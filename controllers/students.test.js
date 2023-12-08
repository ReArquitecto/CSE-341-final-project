// students.test.js
const { getAllStudents, getSingleStudent, createStudent, updateStudent, deleteStudent } = require('./students');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

// Mock student data
const mockStudentsData = [
  {
    _id: new ObjectId(),
    firstName: "Jest",
    lastName: "Test",
    email: "jest@test.com",
    birthday: "1999-12-12",
    gender: "Male",
    address: "786 Test St. Test",
    phoneNumber: "6473856783"
  },
  {
    _id: new ObjectId(),
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@doe.com",
    birthday: "2000-05-15",
    gender: "Female",
    address: "123 Another St. Testville",
    phoneNumber: "6471234567"
  },
  {
    _id: new ObjectId(),
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    birthday: "2000-05-15",
    gender: "Male",
    address: "123 Another St. Testville",
    phoneNumber: "6471234567"
  }
];

const mockStudentId = new ObjectId();
const badStudentId = new ObjectId();

// Mock request and response objects
const req = {
  params: { id: mockStudentId },
  body: mockStudentsData
};

let res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

let mongoServer;

// ALL TESTS FOR THE students.js CONTROLLER
describe('Student Controller', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
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


  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR getAllStudents
  // ✏️ Successful getAllStudents
  test('getAllStudents should retrieve students and return status 200', async () => {
    // Mock the chaining of find().toArray()
    const mockToArray = jest.fn().mockResolvedValue(mockStudentsData);
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
    await getAllStudents(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudentsData);
  });

  // ✏️ getAllStudents error handling
  test('getAllStudents should return status 400 if error occurs', async () => {
    const mockToArray = jest.fn().mockRejectedValue(new Error('Mock error'));
    const mockFind = jest.fn().mockReturnThis();
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: mockFind,
        toArray: mockToArray
      })
    });

    await getAllStudents(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });
  
  
  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR getSingleStudent
  // ✏️ Successful getSingleStudent
  test('getSingleStudent should retrieve a student and return status 200', async () => {
    // Mock the findOne call
    const mockFindOne = jest.fn().mockResolvedValue(mockStudentsData[0]);
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({ findOne: mockFindOne })
    });
    const req = { params: { id: mockStudentsData[0]._id } };
    
    await getSingleStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudentsData[0]);
  });

  // ✏️ getSingleStudent error handling
  test('getSingleStudent should return status 400 if error occurs', async () => {
    // Mock findOne to reject
    const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });
    
    await getSingleStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  // ✏️ getSingleStudent should return status 400 if id is invalid
  test('getSingleStudent should return status 400 if id is invalid', async () => {
    // Mock findOne to return null
    const mockFindOne = jest.fn().mockResolvedValue(null);
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });

    // Send a bad id
    const req = { params: { id: 'badId' } };
    
    await getSingleStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    // expect(res.json).toHaveBeenCalledWith({ message: 'Invalid id' });
  });

  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR createStudent
  // ✏️ Successful createStudent
  test('should create a student and return 200 status', async () => {
    const req = {
      body: {
        firstName: "Jest",
        lastName: "Test",
        email: "jest@test.com",
        birthday: "1999-12-12",
        gender: "Male",
        address: "786 Test St. Test",
        phoneNumber: "6473856783"
      }
    };
    
    // Mock database methods
    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });

  // ✏️ Missing required fields
  test('should return 400 status if required fields are missing', async () => {
    const req = {
      body: {
        // Missing 'email' and other fields
        firstName: "Jest",
        lastName: "Test",
      }
    };

    // Check for required fields
    

  });

  // ✏️ Student already exists
  test('should return 400 status if student already exists', async () => {
    const req = {
      body: {
        firstName: "Jest",
        lastName: "Test",
        email: "existing@test.com",
        birthday: "1999-12-12",
        gender: "Male",
        address: "786 Test St. Test",
        phoneNumber: "6473856783"
      }
    };

    // Mock database methods
    const mockFindOne = jest.fn().mockResolvedValue({ _id: 'existingId', ...req.body });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: mockFindOne
    });

    await createStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student already exists' });
  });

  
  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR updateStudent
  // ✏️ Successful updateStudent
  test('should update a student and return 200 status', async () => {
    const req = {
      params: { id: mockStudentsData[0]._id.toString() },
      body: {
        firstName: "Jest",
        lastName: "Test",
        email: "jest@test.com",
        birthday: "1999-12-12",
        gender: "Male",
        address: "786 Test St. Test",
        phoneNumber: "6473856783"
      }
    };

    // Mock database methods
    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      updateOne: mockUpdateOne
    });

    await updateStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });

// ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
// TESTS FOR deleteStudent
  // ✏️ Successful deleteStudent
  test('should delete a student and return 200 status', async () => {
    const req = {
      params: { id: mockStudentsData[0]._id.toString() }
    };

    // Mock database methods
    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: mockDeleteOne
    });

    await deleteStudent(req, res);
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


