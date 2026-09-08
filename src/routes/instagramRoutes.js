const express = require('express');
const instagramService = require('../services/instagramService');

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await instagramService.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error in /api/posts route:', error.message);
    res.status(error.statusCode || 500).json({
      error: error.publicMessage || 'Unable to retrieve Instagram posts'
    });
  }
});

module.exports = router;
