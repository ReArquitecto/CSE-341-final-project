// Teachers.test.js
const { getAllTeachers, getSingleTeacher, createTeacher, updateTeacher, deleteTeacher } = require('./teachers');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;

// Mock Teacher data
const mockTeachersData = [
  {
    _id: new ObjectId(),
    firstName: "Mark",
    lastName: "Smith",
    email: "ms@gmail.com",
    address: "123 cicle Lane, Rexburg",
    phoneNumber: "1112223333",
    subject: "Art"
  },
  {
    _id: new ObjectId(),
    firstName: "Joey",
    lastName: "Tee",
    email: "jTee@gmail.com",
    address: "123 shiny Lane, Rexburg",
    phoneNumber: "2223334444",
    subject: "Math"
  },
  {
    _id: new ObjectId(),
    firstName: "Karen",
    lastName: "Drea",
    email: "KarenD@gmail.com",
    address: "2223 Sappphire Pt, Rexburg",
    phoneNumber: "3334445555",
    subject: "Literature"
  }
];

const mockTeacherId = new ObjectId();

// Mock request and response objects
const req = {
  params: { id: mockTeacherId },
  body: mockTeachersData
};

let res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

let mongoServer;

describe('Teacher Controller', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongodb.initDb = jest.fn().mockResolvedValue(mongoServer.getUri());
    await mongodb.initDb();
  });

  beforeEach(() => {
    // Reset or reinitialize the res object before each test
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  // Tests for getAllTeachers
test('getAllTeachers should retrieve Teachers and return status 200', async () => {
  // Mock the chaining of find().toArray()
  const mockToArray = jest.fn().mockResolvedValue(mockTeachersData);
  const mockFind = jest.fn().mockReturnThis(); // 'this' refers to the chainable object
  mongodb.initDb
  mongodb.getDb = jest.fn().mockReturnValue({

    collection: jest.fn().mockReturnValue({ 
      find: mockFind,
      toArray: mockToArray
    })
  });

  // Create a mock request object
  const req = {}; 

  // Call the function with the mock request and response
  await getAllTeachers(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockTeachersData);
});

  // ✏️ getAllTeachers error handling
  test('getAllTeachers should return status 400 if error occurs', async () => {
    const mockToArray = jest.fn().mockRejectedValue(new Error('Mock error'));
    const mockFind = jest.fn().mockReturnThis();
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: mockFind,
        toArray: mockToArray
      })
    });

    await getAllTeachers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  test('getSingleTeacher should retrieve a single Teacher and return status 200', async () => {
    // Create a mock req and a mock FindOne function

    const mockFindOne = jest.fn().mockResolvedValue(mockTeachersData[0]);
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({ findOne: mockFindOne})
    });
    const req = { params: { id: mockTeachersData[0]._id } };
  
    // Call the function to test
    await getSingleTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTeachersData[0]);
  });

  test('getSingleTeacher should return status 400 if error occurs', async () => {
    // Mock db.collection.findOne()
    const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });

    await getSingleTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  test('should create a teacher and return 200 status', async () => {
    const req = {
      body: {
        firstName: "Kevin",
        lastName: "Jovie",
        email: "KevinJong@gmail.com",
        address: "123 Rock Point, Rexburg",
        phoneNumber: "2223334445",
        subject: "Math"
      }
    };
    
    // Mock database methods
    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });
  

  test('should return 400 status if required fields are missing', async () => {
    const req = {
      body: {
        // Missing 'email' and other fields
        firstName: "Jest",
        lastName: "Test",
      }
    };

    // Mock database methods
    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ✏️ Teacher already exists
  test('should return 400 status if Teacher already exists', async () => {
    const req = {
      body: {
        firstName: "Mark",
        lastName: "Smith",
        email: "ms@gmail.com",
        address: "123 cicle Lane, Rexburg",
        phoneNumber: "1112223333",
        subject: "Art"
      }
    };

    // Mock database methods
    const mockFindOne = jest.fn().mockResolvedValue({ _id: 'existingId', ...req.body });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: mockFindOne
    });

    await createTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Teacher already exists' });
  });

  

  test('should update a Teacher and return 200 status', async () => {
    const req = {
      params: { id: mockTeachersData[0]._id },
      body: {
        firstName: "Mark",
        lastName: "Smith",
        email: "ms@gmail.com",
        address: "123 cicle Lane, Rexburg",
        phoneNumber: "1112223333",
        subject: "Math"
      }
    };

    // Mock database methods
    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      updateOne: mockUpdateOne
    });

    await updateTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });

// ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
// TESTS FOR deleteTeacher
  // ✏️ Successful deleteTeacher
  test('should delete a Teacher and return 200 status', async () => {
    const req = {
      params: { id: mockTeachersData[0]._id.toString() }
    };

    // Mock database methods
    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: mockDeleteOne
    });

    await deleteTeacher(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });


  // Tests are finished. Close the connections.
  afterAll(async () => {
    await mongodb.closeDB();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
});


