const mongodb = require('../db/connect.js');
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

const getAllTeachers = async (req, res) => {
  //#swagger.tags=['Teachers'];
  try {
    const db = mongodb.getDb();
    const teachers = await db
      .collection('teachers')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(teachers);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const getSingleTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  try {
    const db = mongodb.getDb();
    const teacher = await db
      .collection('teachers')
      .findOne({ _id: new ObjectId(req.params.id) });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(teacher);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }
}

const createTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  try {
    const db = mongodb.getDb();

    // Destructure and trim & sanitize required fields
    let { firstName, lastName, email, birthday, gender, address, phoneNumber, subject } = req.body;

    firstName = validator.trim(firstName);
    lastName = validator.trim(lastName);
    email = validator.normalizeEmail(validator.trim(email));
    address = validator.trim(address);
    phoneNumber = validator.trim(phoneNumber);
    subject = validator.trim(subject);

    if (!firstName || !lastName || !email || !birthday || !gender || !address || !phoneNumber || !subject) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Validate gender
    const validGenders = ['Male', 'Female', 'Non-Binary', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender' });
    }

    // Validate birthday
    if (!validator.isISO8601(birthday) || new Date(birthday) > new Date()) {
      return res.status(400).json({ message: 'Invalid birthday' });
    }

    // Check if teacher already exists
    const existingTeacher = await db
      .collection('teachers')
      .findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    // Create new teacher
    const teacher = { firstName, lastName, email, birthday, gender, address, phoneNumber, subject };
    const response = await db.collection('teachers').insertOne(teacher);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: 'Error occurred',
      error: err.message,
    });
  }
}

const updateTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  try {
    const db = mongodb.getDb();
    const teacherId = new ObjectId(req.params.id);

    // Destructure and trim & sanitize required fields
    let { firstName, lastName, email, birthday, gender, address, phoneNumber, subject } = req.body;

    firstName = validator.trim(firstName);
    lastName = validator.trim(lastName);
    email = validator.normalizeEmail(validator.trim(email));
    address = validator.trim(address);
    phoneNumber = validator.trim(phoneNumber);
    subject = validator.trim(subject);

    if (!firstName || !lastName || !email || !birthday || !gender || !address || !phoneNumber || !subject) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Validate gender
    const validGenders = ['Male', 'Female', 'Non-Binary', 'Other'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender' });
    }

    // Validate birthday
    if (!validator.isISO8601(birthday) || new Date(birthday) > new Date()) {
      return res.status(400).json({ message: 'Invalid birthday' });
    }

    // Update teacher
    const teacher = {firstName, lastName, email, birthday, gender, address, phoneNumber, subject};
    const response = await db.collection('teachers').updateOne(
      { _id: teacherId },
      { $set: teacher },
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: 'Error occurred',
      error: err.message,
    });
  }
}

const deleteTeacher = async (req, res) => {
  //#swagger.tags=['Teachers'];
  try {
    const db = mongodb.getDb();
    const teacherId = new ObjectId(req.params.id);
    const response = await db.collection('teachers').deleteOne({ _id: teacherId });
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
  getAllTeachers,
  getSingleTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
