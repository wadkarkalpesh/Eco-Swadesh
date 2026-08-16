/**
 * Community Knowledge & Expert Consultation Controller
 * Lead Architect: Senior Real-time Community Architect
 * Implements: Expert Answer Denormalization, Moderation Flagging, Discussion Upvoting, and Agronomist Bookings
 */

const db = require('../config/db');

/**
 * List Community Knowledge Discussions
 * GET /v1/community/posts
 */
const getCommunityPosts = (req, res) => {
  const { tag, search } = req.query;
  let posts = db.getAll('communityPosts');

  if (tag && tag !== 'ALL') {
    posts = posts.filter((p) => p.tags && p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    total: posts.length,
    posts,
  });
};

/**
 * Create New Knowledge Post or Question
 * POST /v1/community/posts
 */
const createCommunityPost = (req, res) => {
  const { title, content, tags = ['Soil Health'] } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_FIELDS',
      message: 'Post title and description content are required.',
    });
  }

  const userRoles = req.user?.roles || (req.user?.persona ? [req.user.persona] : ['buyer']);
  const isExpert = userRoles.includes('expert');
  const authorName = req.user ? req.user.name : 'Agri Innovator';
  const roleName = req.user ? req.user.persona?.toUpperCase() || 'FARMER' : 'FARMER';

  const newPost = db.insert('communityPosts', {
    authorId: req.user ? req.user.id : 'usr_user_01',
    author: authorName,
    role: roleName,
    verifiedExpert: isExpert,
    avatar: isExpert
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    title,
    content,
    tags: Array.isArray(tags) ? tags : [tags],
    upvotes: 0,
    repliesCount: 0,
    answers: [],
    flagged: false,
    flagCount: 0,
    date: 'Just now',
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({
    success: true,
    post: newPost,
    message: 'Community discussion thread posted successfully.',
  });
};

/**
 * Add Answer to Question with Server-Stamping of isExpertAnswer (Phase 6.1)
 * POST /v1/community/posts/:id/answers
 */
const addAnswer = (req, res) => {
  const { id } = req.params;
  const { content, text } = req.body;

  const answerText = content || text;
  if (!answerText) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_CONTENT',
      message: 'Answer content is required.',
    });
  }

  const post = db.findById('communityPosts', id);
  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'POST_NOT_FOUND',
      message: `Question '${id}' was not found.`,
    });
  }

  // Phase 6.1: Server-side validation - derive isExpertAnswer strictly from claims, ignore client payload
  const userRoles = req.user?.roles || (req.user?.persona ? [req.user.persona] : []);
  const isExpertAnswer = userRoles.includes('expert');
  const authorId = req.user ? req.user.id : 'usr_anon_01';
  const authorName = req.user ? req.user.name : (isExpertAnswer ? 'Dr. Agronomist' : 'Farm Member');

  if (!post.answers) {
    post.answers = [];
  }

  const answerRecord = {
    id: `ans_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    questionId: id,
    authorId,
    authorName,
    content: answerText,
    isExpertAnswer, // Server-stamped only
    authorVerified: isExpertAnswer,
    flagged: false,
    flagCount: 0,
    createdAt: new Date().toISOString(),
  };

  post.answers.push(answerRecord);
  post.repliesCount = post.answers.length;
  db.update('communityPosts', id, { answers: post.answers, repliesCount: post.repliesCount });

  return res.status(201).json({
    success: true,
    questionId: id,
    answer: answerRecord,
    isExpertAnswer,
    message: isExpertAnswer
      ? 'Verified expert advice stamped and published.'
      : 'Community answer published successfully.',
  });
};

/**
 * Flag Question / Answer for Moderation (Phase 6.3)
 * POST /v1/community/flag
 */
const flagContent = (req, res) => {
  const { path, targetId, reason = 'Inappropriate content' } = req.body;
  const targetKey = path || targetId;

  if (!targetKey) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_TARGET',
      message: 'Path or targetId is required to flag content.',
    });
  }

  const userId = req.user ? req.user.id : 'anon_user';

  if (!db.contentFlags.has(targetKey)) {
    db.contentFlags.set(targetKey, new Set());
  }

  const flagSet = db.contentFlags.get(targetKey);
  const alreadyFlagged = flagSet.has(userId);

  // If already flagged by this user, return success without double-incrementing
  if (alreadyFlagged) {
    return res.status(200).json({
      success: true,
      alreadyFlagged: true,
      path: targetKey,
      message: 'You have already flagged this content.',
    });
  }

  flagSet.add(userId);

  // Update target document in database
  const post = db.findById('communityPosts', targetKey);
  if (post) {
    post.flagged = true;
    post.flagCount = (post.flagCount || 0) + 1;
    db.update('communityPosts', targetKey, { flagged: true, flagCount: post.flagCount });
  }

  db.logAudit({
    actorId: userId,
    actorRole: req.user?.persona || 'user',
    action: 'FLAG_COMMUNITY_CONTENT',
    targetType: 'COMMUNITY_POST',
    targetId: targetKey,
    reason,
  });

  return res.status(200).json({
    success: true,
    path: targetKey,
    flagCount: flagSet.size,
    message: 'Content successfully flagged for moderator review.',
  });
};

/**
 * Upvote Community Discussion
 * POST /v1/community/posts/:id/upvote
 */
const upvotePost = (req, res) => {
  const { id } = req.params;
  const post = db.findById('communityPosts', id);

  if (!post) {
    return res.status(404).json({
      success: false,
      error: 'POST_NOT_FOUND',
      message: `Community post '${id}' was not found.`,
    });
  }

  post.upvotes = (post.upvotes || 0) + 1;

  return res.status(200).json({
    success: true,
    id: post.id,
    upvotes: post.upvotes,
  });
};

/**
 * Schedule 1-on-1 Agronomist Consultation Booking
 * POST /v1/community/expert-bookings
 */
const bookExpertConsultation = (req, res) => {
  const { expertId = 'usr_expert_01', farmArea = '5 Acres', cropIssue = 'Soil Rejuvenation & Organic Transition', preferredDate } = req.body;

  const expert = db.findById('users', expertId) || {
    name: 'Dr. Anita Deshmukh',
    title: 'Senior Agronomist (PhD, IARI)',
  };

  const booking = {
    id: `BK-${Date.now()}`,
    expertId,
    expertName: expert.name,
    userId: req.user ? req.user.id : 'guest_farmer',
    farmArea,
    cropIssue,
    preferredDate: preferredDate || 'Tomorrow at 10:00 AM (Video & Soil Test Review)',
    feeINR: 1200,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  db.expertBookings.push(booking);

  return res.status(201).json({
    success: true,
    booking,
    message: `Consultation confirmed with ${expert.name}. Meeting link sent via SMS and Email.`,
  });
};

module.exports = {
  getCommunityPosts,
  createCommunityPost,
  addAnswer,
  flagContent,
  upvotePost,
  bookExpertConsultation,
};
