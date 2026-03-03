/* eslint-disable consistent-return */
const express = require('express');
const schema = require('../db/schema');
const db = require('../db/connection');

const employees = db.get('employees');

const router = express.Router();

/* Get all employees */

router.get('/', async (req, res, next) => {
  try {
    const allEmployees = await employees.find({});
    res.json(allEmployees);
  } catch (error) {
    next(error);
  }
});

/* Get all distinct job values */
router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await employees.distinct('job');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

/* Get a specific employee */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employees.findOne({
      _id: id,
    });

    if (!employee) {
      const error = new Error('Employee does not exist');/* eslint-disable consistent-return */
const express = require('express');
const schema = require('../db/schema');
const db = require('../db/connection');

// Initialize database collection
const employeesCollection = db.get('employees');
const router = express.Router();

/**
 * @route   GET /api/employees
 * @desc    Get all employees
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const allEmployees = await employeesCollection.find({});
    res.json(allEmployees);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/employees/jobs
 * @desc    Get all distinct job values
 * @access  Public
 */
router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await employeesCollection.distinct('job');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/employees/:id
 * @desc    Get a specific employee by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employeesCollection.findOne({ _id: id });

    if (!employee) {
      res.status(404);
      return next(new Error('Employee does not exist'));
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/employees
 * @desc    Create a new employee
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, job } = req.body;
    const validatedData = await schema.validateAsync({ name, job });

    // Check if employee already exists
    const existingEmployee = await employeesCollection.findOne({ name });
    if (existingEmployee) {
      res.status(409);
      return next(new Error('Employee already exists'));
    }

    // Insert new employee
    const newEmployee = await employeesCollection.insert(validatedData);
    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/employees/:id
 * @desc    Update a specific employee
 * @access  Public
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, job } = req.body;

    // Validate request data
    const validatedData = await schema.validateAsync({ name, job });

    // Check if employee exists
    const employee = await employeesCollection.findOne({ _id: id });
    if (!employee) {
      res.status(404);
      return next(new Error('Employee does not exist'));
    }

    // Update employee (disable upsert to avoid creating new docs accidentally)
    const updatedEmployee = await employeesCollection.update(
      { _id: id },
      { $set: validatedData },
      { upsert: false }
    );

    res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete a specific employee
 * @access  Public
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const employee = await employeesCollection.findOne({ _id: id });
    if (!employee) {
      res.status(404);
      return next(new Error('Employee does not exist'));
    }

    // Delete employee
    await employeesCollection.remove({ _id: id });
    res.json({ message: 'Employee has been deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
      return next(error);
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

/* Create a new employee */
router.post('/', async (req, res, next) => {
  try {
    const { name, job } = req.body;
    await schema.validateAsync({ name, job });

    const employee = await employees.findOne({
      name,
    });

    // Employee already exists
    if (employee) {
      const error = new Error('Employee already exists');
      res.status(409); // conflict error
      return next(error);
    }

    const newuser = await employees.insert({
      name,
      job,
    });

    res.status(201).json(newuser);
  } catch (error) {
    next(error);
  }
});

/* Update a specific employee */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, job } = req.body;
    const result = await schema.validateAsync({ name, job });
    const employee = await employees.findOne({
      _id: id,
    });

    // Employee does not exist
    if (!employee) {
      return next();
    }

    const updatedEmployee = await employees.update({
      _id: id,
    }, { $set: result },
    { upsert: true });

    res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
});

/* Delete a specific employee */
// /655afa8196943302b03283bd
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employees.findOne({
      _id: id,
    });

    // Employee does not exist
    if (!employee) {
      return next();
    }
    await employees.remove({
      _id: id,
    });

    res.json({
      message: 'Employee has been deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
