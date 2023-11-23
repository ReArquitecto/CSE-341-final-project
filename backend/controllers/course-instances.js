const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

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
    res.status(500).json(err);
  }
};

const getSingleCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  const courseInstanceId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('courseInstances')
    .find({ _id: courseInstanceId });
  result
    .toArray()
    .then((courseInstances) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(courseInstances);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const createCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  const courseInstance = {
    course: req.body.course,
    teacher: req.body.teacher,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    location: req.body.location,
    students: req.body.students,
  };
  const response = await mongodb
    .getDb()
    .collection('courseInstances')
    .insertOne(courseInstance);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating course instance');
  }
};

const updateCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  const courseInstanceId = new ObjectId(req.params.id);
  const courseInstance = {
    course: req.body.course,
    teacher: req.body.teacher,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    location: req.body.location,
    students: req.body.students,
  };
  const response = await mongodb
    .getDb()
    .collection('courseInstances')
    .updateOne({ _id: courseInstanceId }, { $set: courseInstance });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating course instance');
  }
};

const deleteCourseInstance = async (req, res) => {
  //#swagger.tags=['Course-Instances'];
  const courseInstanceId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('courseInstances')
    .deleteOne({ _id: courseInstanceId });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error deleting course instance');
  }
};

module.exports = {
  getAllCourseInstances,
  getSingleCourseInstance,
  createCourseInstance,
  updateCourseInstance,
  deleteCourseInstance,
};
