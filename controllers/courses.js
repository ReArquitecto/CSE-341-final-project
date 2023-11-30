const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

const getAllCourses = async (req, res) => {
  //#swagger.tags=['Courses'];
  try {
    const db = mongodb.getDb();
    const courses = await db
    .collection('courses')
    .find()
    .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(courses);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const getSingleCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  try {
    const db = mongodb.getDb();
    const course = await db
    .collection('courses')
    .findOne({ _id: new ObjectId(req.params.id) });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(course);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const createCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  try {
    const db = mongodb.getDb();
    
    // Destructure trim and sanitize required fields
    let { department, code, name, description, credit_hours, prerequisites } = req.body;
    department = department;
    code = code;
    name = name;
    description = description;
    credit_hours = credit_hours;
    prerequisites = prerequisites

    const course = {
      department,
      code,
      name,
      description,
      credit_hours,
      prerequisites
    };

    const response = await db.collection('courses').insertOne(course);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Course created successfully' });
    }
    
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const updateCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  try {
    const db = mongodb.getDb();
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid userinfo id to update a userinfo.');
    }
    // Destructure trim and sanitize required fields
    let { department, code, name, description, credit_hours, prerequisites } = req.body;
    department =department;
    code =code;
    name =name;
    description =description;
    credit_hours =credit_hours;
    prerequisites =prerequisites



    const course = {
      department,
      code,
      name,
      description,
      credit_hours,
      prerequisites
    };

    const response = await db.collection('courses').updateOne({ _id: new ObjectId(req.params.id) }, { $set: course });

    if (response.acknowledged) {
      res.status(201).json({ message: 'Course updated successfully' });
    }
    
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const deleteCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  try {
    const db = mongodb.getDb();
    const response = await db.collection('courses').deleteOne({ _id: new ObjectId(req.params.id) });
    if (response.acknowledged) {
      res.status(200).json({ message: 'Course deleted successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
