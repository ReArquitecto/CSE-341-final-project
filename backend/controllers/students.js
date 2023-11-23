const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;

const getAllStudents = async (req, res) => {
    //#swagger.tags=['students'];
    try {
        const db = mongodb.getDb();
        const students = await db.collection('students').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json(err);
    }
};


const getSingleStudent = async (req, res) => {
    //#swagger.tags=['students'];
    const studentId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('students').find({ _id: studentId });
    result.toArray().then((students) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    }).catch(err => {
        res.status(500).json(err);
    });
};

const createStudent = async (req, res) => {
    //#swagger.tags=['students'];
    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDb().collection('students').insertOne(student);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error updating student');
    }
};

const updateStudent = async (req, res) => {
    //#swagger.tags=['students'];
    const studentId = new ObjectId(req.params.id);
    const student = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDb().collection('students').replaceOne({ _id: studentId }, student, { upsert: true });
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error updating student');
    }
};

const deleteStudent = async (req, res) => {
    //#swagger.tags=['students'];
    const studentId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('students').deleteOne({ _id: studentId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error deleting student');
    }
}

module.exports = {
    getAllStudents,
    getSingleStudent,
    createStudent,
    updateStudent,
    deleteStudent
};