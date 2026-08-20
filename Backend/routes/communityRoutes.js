const express = require('express');
const router = express.Router();
const {
  getCommunityPosts,
  createCommunityPost,
  addAnswer,
  flagContent,
  upvotePost,
  bookExpertConsultation,
} = require('../controllers/communityController');
const { optionalJWT, authenticateJWT } = require('../middleware/auth');

router.get('/posts', optionalJWT, getCommunityPosts);
router.post('/posts', optionalJWT, createCommunityPost);
router.post('/posts/:id/answers', optionalJWT, addAnswer);
router.post('/questions/:id/answers', optionalJWT, addAnswer);
router.post('/posts/:id/upvote', optionalJWT, upvotePost);
router.post('/flag', optionalJWT, flagContent);
router.post('/expert-bookings', optionalJWT, bookExpertConsultation);

module.exports = router;
