// Enrollments.test.js
const { getAllEnrollments, getSingleEnrollment, createEnrollment, updateEnrollment, deleteEnrollment } = require('./Enrollments');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;

// Mock Enrollment data
const mockEnrollmentsData = [
  {
    _id: new ObjectId(),
    courseInstanceId: "656a0fbbb6e208ee466e63fa",
    studentId: "656df40560612f80290a6eba"
  },
  {
    _id: new ObjectId(),
    courseInstanceId: "65709d569102d0ad5b253bcc",
    studentId: "656df40560612f80290a6eba"
  },
];

const mockEnrollmentId = new ObjectId();

// Mock request and response objects
const req = {
  params: { id: mockEnrollmentId },
  body: mockEnrollmentsData
};

let res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

let mongoServer;

// ALL TESTS FOR THE Enrollments.js CONTROLLER
describe('Enrollment Controller', () => {
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
  // TESTS FOR getAllEnrollments
  // ✏️ Successful getAllEnrollments
  test('getAllEnrollments should retrieve Enrollments and return status 200', async () => {
    // Mock the chaining of find().toArray()
    const mockToArray = jest.fn().mockResolvedValue(mockEnrollmentsData);
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
    await getAllEnrollments(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEnrollmentsData);
  });

  // ✏️ getAllEnrollments error handling
  test('getAllEnrollments should return status 400 if error occurs', async () => {
    const mockToArray = jest.fn().mockRejectedValue(new Error('Mock error'));
    const mockFind = jest.fn().mockReturnThis();
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: mockFind,
        toArray: mockToArray
      })
    });

    await getAllEnrollments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });
  
  
  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR getSingleEnrollment
  // ✏️ Successful getSingleEnrollment
  test('getSingleEnrollment should retrieve a Enrollment and return status 200', async () => {
    // Mock the findOne call
    const mockFindOne = jest.fn().mockResolvedValue(mockEnrollmentsData[0]);
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({ findOne: mockFindOne })
    });
    const req = { params: { id: mockEnrollmentsData[0]._id } };
    
    await getSingleEnrollment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEnrollmentsData[0]);
  });

  // ✏️ getSingleEnrollment error handling
  test('getSingleEnrollment should return status 400 if error occurs', async () => {
    // Mock findOne to reject
    const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });
    
    await getSingleEnrollment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });


  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR createEnrollment
  // ✏️ Successful createEnrollment
  test('should create a Enrollment and return 200 status', async () => {
    const req = {
      body: {
        courseInstanceId: "65709e71fb61ea0bafb11e0f",
        studentId: "656df40560612f80290a6eba"
      }
    };
    
    // Mock database methods
    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createEnrollment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });

  // ✏️ Missing required fields
  test('should return 400 status if required fields are missing', async () => {
    const req = {
      body: {
        studentId: "656df40560612f80290a6eba"
      }
    };

    // Mock database methods
    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createEnrollment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  
  
  // ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
  // TESTS FOR updateEnrollment
  // ✏️ Successful updateEnrollment
  test('should update a Enrollment and return 200 status', async () => {
    const req = {
      params: { id: mockEnrollmentsData[0]._id.toString() },
      body: {
        courseInstanceId: "656a0fbbb6e208ee466e63fa",
        studentId: "656df40560612f80290a6eba"
      }
    };

    // Mock database methods
    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      updateOne: mockUpdateOne
    });

    await updateEnrollment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });

// ✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️✌️
// TESTS FOR deleteEnrollment
  // ✏️ Successful deleteEnrollment
  test('should delete a Enrollment and return 200 status', async () => {
    const req = {
      params: { id: mockEnrollmentsData[0]._id.toString() }
    };

    // Mock database methods
    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: mockDeleteOne
    });

    await deleteEnrollment(req, res);
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


