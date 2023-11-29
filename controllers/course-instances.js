const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

const getAllCourseInstances = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  try {
    const db = mongodb.getDb();
    const courseInstances = await db
      .collection('courseInstances')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(courseInstances);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const getSingleCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  try {
    const db = mongodb.getDb();
    const courseInstance = await db
      .collection('courseInstances')
      .findOne({ _id: new ObjectId(req.params.id) });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(courseInstance);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const createCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  try {
    const db = mongodb.getDb();
    
    // Destructure trim and sanitize required fields
    let { courseId, teacherId, semester, year, location, time, schedule, maxStudentCount } = req.body;
    courseId = validator.trim(courseId);
    teacherId = validator.trim(teacherId);
    semester = validator.trim(semester);
    year = validator.trim(year);
    location = validator.trim(location);
    time = validator.trim(time);
    schedule = validator.trim(schedule);
    maxStudentCount = validator.trim(maxStudentCount);

    if (!courseId || !teacherId || !semester || !year || !location || !time || !schedule || !maxStudentCount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate code
    if (!validator.isAlphanumeric(courseId)) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Validate department
    if (!validator.isAlphanumeric(teacherId)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    // Validate year
    if (!validator.isNumeric(year)) {
      return res.status(400).json({ message: 'Invalid year' });
    }

    // Validate maxStudentCount
    if (!validator.isNumeric(maxStudentCount)) {
      return res.status(400).json({ message: 'Invalid maxStudentCount' });
    }

    const courseInstance = {
      courseId,
      teacherId,
      semester,
      year,
      location,
      time,
      schedule,
      maxStudentCount,
    };

    const response = await db.collection('courseInstances').insertOne(courseInstance);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Course instance created' });
    } else {
      res.status(500).json({ message: 'Error creating course instance' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const updateCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  try {
    const db = mongodb.getDb();
    const courseInstanceId = new ObjectId(req.params.id);

    // Destructure trim and sanitize required fields
    let { courseId, teacherId, semester, year, location, time, schedule, maxStudentCount } = req.body;
    courseId = validator.trim(courseId);
    teacherId = validator.trim(teacherId);
    semester = validator.trim(semester);
    year = validator.trim(year);
    location = validator.trim(location);
    time = validator.trim(time);
    schedule = validator.trim(schedule);
    maxStudentCount = validator.trim(maxStudentCount);

    if (!courseId || !teacherId || !semester || !year || !location || !time || !schedule || !maxStudentCount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate code
    if (!validator.isAlphanumeric(courseId)) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Validate department
    if (!validator.isAlphanumeric(teacherId)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    // Validate year
    if (!validator.isNumeric(year)) {
      return res.status(400).json({ message: 'Invalid year' });
    }

    // Validate maxStudentCount
    if (!validator.isNumeric(maxStudentCount)) {
      return res.status(400).json({ message: 'Invalid maxStudentCount' });
    }

    const courseInstance = {
      courseId,
      teacherId,
      semester,
      year,
      location,
      time,
      schedule,
      maxStudentCount,
    };

    const response = await db.collection('courseInstances').updateOne(
      { _id: courseInstanceId },
      { $set: courseInstance },
    );
    if (response.acknowledged) {
      res.status(200).json({ message: 'Course instance updated' });
    } else {
      res.status(500).json({ message: 'Error updating course instance' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const deleteCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  try {
    const db = mongodb.getDb();
    const response = await db.collection('courseInstances').deleteOne(
      { _id: new ObjectId(req.params.id) },
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

module.exports = {
  getAllCourseInstances,
  getSingleCourseInstance,
  createCourseInstance,
  updateCourseInstance,
  deleteCourseInstance,
};