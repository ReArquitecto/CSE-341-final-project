const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

const getAllCourseInstances = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  try {
    const db = mongodb.getDb();
    const courseInstances = await db
      .collection('course-instances')
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
      .collection('course-instances')
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
    

    let { courseId, teacherId, semester, year, location, time, schedule, maxStudentCount } = req.body;
    courseId =courseId;
    teacherId =teacherId;
    semester =semester;
    year =year;
    location =location;
    time =time;
    schedule =schedule;
    maxStudentCount =maxStudentCount;


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

    const response = await db.collection('course-instances').insertOne(courseInstance);
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
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid userinfo id to update a userinfo.');
    }
    const courseInstanceId = new ObjectId(req.params.id);


    let { courseId, teacherId, semester, year, location, time, schedule, maxStudentCount } = req.body;
    courseId =courseId;
    teacherId =teacherId;
    semester =semester;
    year =year;
    location =location;
    time =time;
    schedule =schedule;
    maxStudentCount =maxStudentCount;


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

    const response = await db.collection('course-instances').updateOne(
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
    const response = await db.collection('course-instances').deleteOne(
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
