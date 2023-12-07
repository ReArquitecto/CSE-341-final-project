const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

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
    
    // Destructure trim and sanitize required fields
    let { courseId, teacherId, semester, year, location, startTime, endTime, schedule, maxStudentCount } = req.body;
    courseId = validator.trim(courseId);
    teacherId = validator.trim(teacherId);
    semester = validator.trim(semester);
    year = validator.trim(year);
    location = validator.trim(location);
    startTime = validator.trim(startTime);
    endTime = validator.trim(endTime);
    schedule = validator.trim(schedule);
    maxStudentCount = validator.trim(maxStudentCount);

    if (!courseId || !teacherId || !semester || !year || !location || !startTime || !endTime || !schedule || !maxStudentCount) {
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

    //Validate semester
    if (typeof semester !== 'string') {
      return res.status(400).json({ message: 'Invalid semester' });
    }

    // Validate year
    if (!validator.isAlphanumeric(year)) {
      return res.status(400).json({ message: 'Invalid year' });
    }

    
  
     //Validate location
     if (typeof location !== 'string') {
      return res.status(400).json({ message: 'Invalid location' });

    }
      //Validate startTime
      if (typeof startTime !== 'string') {
        return res.status(400).json({ message: 'Invalid startTime' });
  
      }
     //Validate schedule
     if (typeof schedule !== 'string') {
      return res.status(400).json({ message: 'Invalid schedule' });

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
      startTime,
      endTime,
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
  


   
    let { courseId, teacherId, semester, year, location, startTime, endTime, schedule, maxStudentCount } = req.body;
    courseId = validator.trim(courseId);
    teacherId = validator.trim(teacherId);
    semester = validator.trim(semester);
    year = validator.trim(year);
    location = validator.trim(location);
    startTime = validator.trim(startTime);
    endTime = validator.trim(endTime);
    schedule = validator.trim(schedule);
    maxStudentCount = validator.trim(maxStudentCount);

    if (!courseId || !teacherId || !semester || !year || !location || !startTime || !endTime || !schedule || !maxStudentCount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    
    // Validate code
    if (!validator.isAlphanumeric(courseId)) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Validate department
    if (!validator.isAlphanumeric(teacherId)) {
      return res.status(400).json({ message: 'Invalid Teacher' });
    }

    //Validate semester
    if (typeof semester !== 'string') {
      return res.status(400).json({ message: 'Invalid semester' });
    }

    if (!validator.isAlphanumeric(year)) {
      return res.status(400).json({ message: 'Invalid year' });
    }

  
     //Validate location
     if (typeof location !== 'string') {
      return res.status(400).json({ message: 'Invalid location' });

    }
      //Validate startTime
      if (typeof startTime !== 'string') {
        return res.status(400).json({ message: 'Invalid startTime' });
  
      }
     //Validate schedule
     if (typeof schedule !== 'string') {
      return res.status(400).json({ message: 'Invalid schedule' });

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
      startTime,
      endTime,
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
