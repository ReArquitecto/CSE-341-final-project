// Enrollments.test.js
const { getAllEnrollments, getSingleEnrollment, createEnrollment, updateEnrollment, deleteEnrollment } = require('./enrollments');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;

// Mock Enrollment data
const mockEnrollmentData = [
  {
    _id: new ObjectId(),
    courseInstanceId: "656a0fbbb6e208ee466e63fa",
    studentId: "656df40560612f80290a6eba"
  }
];

const mockEnrollmentId = new ObjectId();

// Mock request and response objects
const req = {
  params: { id: mockEnrollmentId },
  body: mockEnrollmentData
};

const res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe('Enrollment Controller', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongodb.connect = jest.fn().mockResolvedValue(mongoServer.getUri());
  });

  // Tests for getAllEnrollments
test('getAllEnrollments should retrieve Enrollments and return status 200', async () => {
  // Mock the chaining of find().toArray()
  const mockToArray = jest.fn().mockResolvedValue(mockEnrollmentsData);
  const mockFind = jest.fn().mockReturnThis(); // 'this' refers to the chainable object
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

  test('getAllEnrollments should return status 400 if error occurs', async () => {
    // Mock db.collection.find().toArray()
    const mockFind = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ find: mockFind }) });

    await getAllEnrollments(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  test('getSingleEnrollment should retrieve a single Enrollment and return status 200', async () => {
    // Create a mock req and a mock FindOne function
    const req = { params: { id: mockEnrollmentsData[0]._id.toString() } };
    const mockFindOne = jest.fn().mockImplementation(({ _id }) => {
      const Enrollment = mockEnrollmentsData.find(Enrollment => Enrollment._id.toString() === _id);
      return Promise.resolve(Enrollment);
    });
  
    // Mock getDb to return an object with a collection function that returns an object with the findOne function
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });

    // Set up the mock response object
    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    // Call the function to test
    await getSingleEnrollment(req, res);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(mockEnrollmentsData[0]._id) });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEnrollmentsData[0]);
  });

  test('getSingleEnrollment should return status 400 if error occurs', async () => {
    // Mock db.collection.findOne()
    const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });

    await getSingleEnrollment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });


  // Tests for createEnrollment
  describe('createEnrollment', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful creation
    test('should create a Enrollment and return 200 status', async () => {
      const req = {
        body: {
            courseInstanceId: "656f6eefdbc73063817733df",
            studentId: "656df40560612f80290a6eba"
        }
      };
      
      // Mock database methods
      const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue(null), // Simulate that the Enrollment doesn't already exist
        insertOne: mockInsertOne
      });
  
      // Call the function with the mock request and response
      await createEnrollment(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
    });
  
    // Missing required fields
    test('should return 400 status if required fields are missing', async () => {
      const req = {
        body: {
          // Missing Fields
          courseInstanceId: "656f6eefdbc73063817733df",
        }
      };
  
      // Call the function with the mock request and response
      await createEnrollment(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });
  
    // Enrollment already exists
    test('should return 400 status if Enrollment already exists', async () => {
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
  
      // Call the function with the mock request and response
      await createEnrollment(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Enrollment already exists' });
    });
  
    // ... additional tests for other validation failures
  });

  // Tests for updateEnrollment
  describe('updateEnrollment', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful update
    test('should update a Enrollment and return 200 status', async () => {
      const req = {
        params: { id: mockEnrollmentsData[0]._id.toString() },
        body: {
            courseInstanceId: "65709d569102d0ad5b253bcc",
            studentId: "656df40560612f80290a6eba"
        }
      };

      // Mock database methods
      const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        updateOne: mockUpdateOne
      });

      // Call the function with the mock request and response
      await updateEnrollment(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
    }
  )}
  );

  // Tests for deleteEnrollment
  describe('deleteEnrollment', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful deletion
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

      // Call the function with the mock request and response
      await deleteEnrollment(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
    }
  )}
  );

  afterAll(async () => {
    // Disconnect from the in-memory database after tests are done
    await mongodb.close();
  });
});
