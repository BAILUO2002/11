/* eslint-disable consistent-return */
const express = require('express');
const db = require('../db/connection');

const users = db.get('user');

const router = express.Router();

/* Get all users */
router.get('/', async (req, res, next) => {
  try {
    const allUsers = await users.find({});
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

/* Get all distinct job values from users */
router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await users.distinct('job');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

/* Get users with IDs within a given range (using query parameters) */
router.get('/range', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      const error = new Error('Both start and end query parameters are required');
      res.status(400);
      return next(error);
    }

    const usersInRange = await users.find({
      _id: { $gte: start, $lte: end },
    });

    res.json(usersInRange);
  } catch (error) {
    next(error);
  }
});

/* Get a user by username */
router.get('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await users.findOne({
      username,
    });

    if (!user) {
      const error = new Error('User does not exist');
      res.status(404);
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/* Get a user by _id */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await users.findOne({
      _id: id,
    });

    if (!user) {
      const error = new Error('User does not exist');
      res.status(404);
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
