const express = require('express');
const db = require('../db/connection');

// Initialize database collection and router
const usersCollection = db.get('user');
const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const allUsers = await usersCollection.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/jobs
 * @desc    Get all distinct user job titles
 * @access  Public
 */
router.get('/jobs', async (req, res, next) => {
  try {
    const distinctJobs = await usersCollection.distinct('job');
    res.json(distinctJobs);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/range
 * @desc    Get users by ID range (query params: start, end)
 * @access  Public
 */
router.get('/range', async (req, res, next) => {
  try {
    const { start, end } = req.query;

    // Validate required parameters
    if (!start || !end) {
      res.status(400);
      return next(new Error('Bad request: Both start and end parameters are required'));
    }

    const usersInRange = await usersCollection.find({
      _id: { $gte: start, $lte: end }
    });

    res.json(usersInRange);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/username/:username
 * @desc    Get a single user by username
 * @access  Public
 */
router.get('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await usersCollection.findOne({ username });

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by _id
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersCollection.findOne({ _id: id });

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
