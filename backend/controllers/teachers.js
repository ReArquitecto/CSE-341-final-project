const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

const getAllTeachers = async (req, res) => {
  //#swagger.tags=['Teachers'];
  try {
    const db = mongodb.getDb();
    const teachers = await db.collection('teachers').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  const teacherId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .collection('teachers')
    .find({ _id: teacherId });
  result
    .toArray()
    .then((teachers) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(teachers);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const createTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  const teacher = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDb()
    .collection('teachers')
    .insertOne(teacher);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating teacher');
  }
};

const updateTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  const teacherId = new ObjectId(req.params.id);
  const teacher = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };
  const response = await mongodb
    .getDb()
    .collection('teachers')
    .updateOne({ _id: teacherId }, { $set: teacher });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error updating teacher');
  }
};

const deleteTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  const teacherId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .collection('teachers')
    .deleteOne({ _id: teacherId });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error deleting teacher');
  }
};

module.exports = {
  getAllTeachers,
  getSingleTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
