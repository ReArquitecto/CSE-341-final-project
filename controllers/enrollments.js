const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

const getAllEnrollments = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  try {
    const db = mongodb.getDb();
    const enrollments = await db
      .collection('enrollments')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const getSingleEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  try {
    const db = mongodb.getDb();
    const enrollment = await db
      .collection('enrollments')
      .findOne({ _id: new ObjectId(req.params.id) });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(enrollment);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const createEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  try {
    const db = mongodb.getDb();
    
    // Destructure trim and sanitize required fields
    let { courseInstanceId, studentId } = req.body;
    courseInstanceId = validator.trim(courseInstanceId);
    studentId = validator.trim(studentId);

    if (!courseInstanceId || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate courseInstanceId
    if (!validator.isAlphanumeric(courseInstanceId)) {
      return res.status(400).json({ message: 'Invalid courseInstanceId' });
    }

    // Validate studentId
    if (!validator.isAlphanumeric(studentId)) {
      return res.status(400).json({ message: 'Invalid studentId' });
    }

    const enrollment = {
      courseInstanceId,
      studentId,
    };

    const response = await db.collection('enrollments').insertOne(enrollment);
    if (response.acknowledged) {
      res.status(201).json(response.ops[0]);
    } else {
      res.status(500).json(response.error || 'Error creating enrollment');
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const updateEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  try {
    const db = mongodb.getDb();
    const enrollmentId = new ObjectId(req.params.id);
    const { courseInstanceId, studentId } = req.body;
    const updateEnrollment = {};
    if (courseInstanceId) {
      updateEnrollment.courseInstanceId = validator.trim(courseInstanceId);
    }
    if (studentId) {
      updateEnrollment.studentId = validator.trim(studentId);
    }
    const response = await db
      .collection('enrollments')
      .updateOne({ _id: enrollmentId }, { $set: updateEnrollment });
    if (response.acknowledged) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response.error || 'Error updating enrollment');
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const deleteEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  try {
    const db = mongodb.getDb();
    const response = await db
      .collection('enrollments')
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.acknowledged) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response.error || 'Error deleting enrollment');
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

module.exports = {
  getAllEnrollments,
  getSingleEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
