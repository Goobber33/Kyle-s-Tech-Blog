const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../../models');
const authMiddleware = require('../../middleware/authMiddleware');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a post by id
router.get('/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username'],
            },
          ],
        },
      ],
    });
    if (!postData) {
      res.status(404).json({ message: `Post with id ${req.params.id} not found` });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedPost = await Post.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!updatedPost[0]) {
      res.status(404).json({ message: `Post with id ${req.params.id} not found` });
      return;
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: `Post with id ${req.params.id} not found` });
      return;
    }

    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new comment
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
      post_id: req.params.id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
