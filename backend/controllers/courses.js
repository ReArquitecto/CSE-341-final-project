const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

const getAllCourses = async (req, res) => {
  //#swagger.tags=['Courses'];
  try {
    const db = mongodb.getDb();
    const courses = await db.collection('courses').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  const courseId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('courses')
    .find({ _id: courseId });
  result
    .toArray()
    .then((courses) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(courses);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const createCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  const course = {
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    length: req.body.length,
    topic: req.body.topic,
    price: req.body.price,
    rating: req.body.rating,
  };
  const response = await mongodb
    .getDb()
    .collection('courses')
    .insertOne(course);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating course');
  }
};

const updateCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  const courseId = new ObjectId(req.params.id);
  const course = {
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    length: req.body.length,
    topic: req.body.topic,
    price: req.body.price,
    rating: req.body.rating,
  };
  const response = await mongodb
    .getDb()
    .collection('courses')
    .updateOne({ _id: courseId }, { $set: course });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating course');
  }
};

const deleteCourse = async (req, res) => {
  //#swagger.tags=['Courses'];
  const courseId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('courses')
    .deleteOne({ _id: courseId });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error deleting course');
  }
};

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
