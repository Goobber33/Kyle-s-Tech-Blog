const router = require('express').Router();
const { Comment } = require('../../models');

// CREATE new comment
router.post('/', async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE comment by id
router.put('/:id', async (req, res) => {
  try {
    const updatedComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE comment by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    res.status(200).json(deletedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
