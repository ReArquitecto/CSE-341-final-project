const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

const getAllEnrollments = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  try {
    const db = mongodb.getDb();
    const enrollments = await db.collection('enrollments').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  const enrollmentId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('enrollments')
    .find({ _id: enrollmentId });
  result
    .toArray()
    .then((enrollments) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(enrollments);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const createEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  const enrollment = {
    courseInstance: req.body.courseInstance,
    student: req.body.student,
    enrollmentDate: req.body.enrollmentDate,
    grade: req.body.grade,
  };
  const response = await mongodb
    .getDb()
    .collection('enrollments')
    .insertOne(enrollment);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating enrollment');
  }
};

const updateEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  const enrollmentId = new ObjectId(req.params.id);
  const enrollment = {
    courseInstance: req.body.courseInstance,
    student: req.body.student,
    enrollmentDate: req.body.enrollmentDate,
    grade: req.body.grade,
  };
  const response = await mongodb
    .getDb()
    .collection('enrollments')
    .updateOne({ _id: enrollmentId }, { $set: enrollment });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating enrollment');
  }
};

const deleteEnrollment = async (req, res) => {
  //#swagger.tags=['Enrollments'];
  const enrollmentId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('enrollments')
    .deleteOne({ _id: enrollmentId });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error deleting enrollment');
  }
};

module.exports = {
  getAllEnrollments,
  getSingleEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
