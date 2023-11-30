const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;



const getAllStudents = async (req, res) => {
  //#swagger.tags=['Students'];
  try {
    const db = mongodb.getDb();
    const students = await db
      .collection('students')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const getSingleStudent = async (req, res) => {
  //#swagger.tags=['Students'];
  try {
    const db = mongodb.getDb();
    const student = await db
      .collection('students')
      .findOne({ _id: new ObjectId(req.params.id) });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const createStudent = async (req, res) => {
  //#swagger.tags=['Students'];
  try {
    const db = mongodb.getDb();

    // Destructure and trim & sanitize required fields
    let { firstName, lastName, email, birthday, gender, address, phoneNumber } = req.body;

    firstName = firstName;
    lastName = lastName;
    email = email;
    birthday = birthday,
     gender =gender;
    address = address;
    phoneNumber = phoneNumber;



    // Check if student already exists
    const existingStudent = await db
      .collection('students')
      .findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Create student
    const student = {
       firstName, 
       lastName, 
       email, 
       birthday, 
       gender,
       address, 
       phoneNumber
       };
    const response = await db.collection('students').insertOne(student);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: 'Error occurred',
      error: err.message,
    });
  }
}

const updateStudent = async (req, res) => {
  //#swagger.tags=['Students'];
 
  try {
    const db = mongodb.getDb();
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid userinfo id to update a userinfo.');
  }
    const studentId = new ObjectId(req.params.id);
    // Update student
    const student = {
      firstName,
      lastName,
      email, 
      birthday,
      gender, 
      address, 
      phoneNumber};
    const response = await db.collection('students').updateOne(
      { _id: studentId },
      { $set: student },);
      
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  //#swagger.tags=['Students'];
  try {
    const db = mongodb.getDb();
    const response = await db.collection('students').deleteOne(
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
};

module.exports = {
  getAllStudents,
  getSingleStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
