const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const authMiddleware = require('../../middleware/authMiddleware');

// Register user
router.post('/register', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    req.session.user_id = newUser.id;
    req.session.logged_in = true;
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Log in user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      res.status(400).json({ message: 'Incorrect email or password' });
      return;
    }

    const validPassword = await user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password' });
      return;
    }

    req.session.user_id = user.id;
    req.session.logged_in = true;

    res.status(200).json({ user: user, message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Log out user
router.post('/logout', authMiddleware, (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get single user by ID
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (!userData) {
      res.status(404).json({ message: `User with id ${req.params.id} not found` });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update user by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.update(req.body, {
      individualHooks: true,
      where: { id: req.params.id },
    });
    if (!updatedUser[0]) {
      res.status(404).json({ message: `User with id ${req.params.id} not found` });
      return;
    }
    res.status(200).json({ message: `User with id ${req.params.id} updated successfully` });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete user by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.destroy({ where: { id: req.params.id } });
    if (!deletedUser) {
      res.status(404).json({ message: `User with id ${req.params.id} not found` });
      return;
    }
    res.status(200).json({ message: `User with id ${req.params.id} deleted successfully` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
