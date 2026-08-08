const express = require('express');
const router = express.Router();
const {
  getCommunityPosts,
  createCommunityPost,
  upvotePost,
  bookExpertConsultation,
} = require('../controllers/communityController');
const { optionalJWT } = require('../middleware/auth');

router.get('/posts', optionalJWT, getCommunityPosts);
router.post('/posts', optionalJWT, createCommunityPost);
router.post('/posts/:id/upvote', optionalJWT, upvotePost);
router.post('/expert-bookings', optionalJWT, bookExpertConsultation);

module.exports = router;
