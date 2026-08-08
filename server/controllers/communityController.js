/**
 * Community Knowledge & Expert Consultation Controller
 * Lead Architect: Senior Real-time Community Architect
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
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    total: posts.length,
    posts,
  });
};

/**
 * Create New Knowledge Post or Experience Share
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

  const isExpert = req.user ? req.user.persona === 'expert' : false;
  const authorName = req.user ? req.user.name : 'Agri Innovator';
  const roleName = req.user ? req.user.persona.toUpperCase() : 'FARMER';

  const newPost = db.insert('communityPosts', {
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
  upvotePost,
  bookExpertConsultation,
};
