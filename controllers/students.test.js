// students.test.js
const { getAllStudents, getSingleStudent, createStudent, updateStudent, deleteStudent } = require('./students');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;

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

// Mock request and response objects
const req = {
  params: { id: mockStudentId },
  body: mockStudentData
};

const res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe('Student Controller', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongodb.connect = jest.fn().mockResolvedValue(mongoServer.getUri());
  });

  // Tests for getAllStudents
test('getAllStudents should retrieve students and return status 200', async () => {
  // Mock the chaining of find().toArray()
  const mockToArray = jest.fn().mockResolvedValue(mockStudentsData);
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
  await getAllStudents(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockStudentsData);
});

  test('getAllStudents should return status 400 if error occurs', async () => {
    // Mock db.collection.find().toArray()
    const mockFind = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ find: mockFind }) });

    await getAllStudents(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  test('getSingleStudent should retrieve a single student and return status 200', async () => {
    // Create a mock req and a mock FindOne function
    const req = { params: { id: mockStudentsData[0]._id.toString() } };
    const mockFindOne = jest.fn().mockImplementation(({ _id }) => {
      const student = mockStudentsData.find(student => student._id.toString() === _id);
      return Promise.resolve(student);
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
    await getSingleStudent(req, res);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(mockStudentsData[0]._id) });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudentsData[0]);
  });

  test('getSingleStudent should return status 400 if error occurs', async () => {
    // Mock db.collection.findOne()
    const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });

    await getSingleStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });


  // Tests for createStudent
  describe('createStudent', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful creation
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
        findOne: jest.fn().mockResolvedValue(null), // Simulate that the student doesn't already exist
        insertOne: mockInsertOne
      });
  
      // Call the function with the mock request and response
      await createStudent(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
    });
  
    // Missing required fields
    test('should return 400 status if required fields are missing', async () => {
      const req = {
        body: {
          // Missing 'email' and other fields
          firstName: "Jest",
          lastName: "Test"
        }
      };
  
      // Call the function with the mock request and response
      await createStudent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });
  
    // Student already exists
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
  
      // Call the function with the mock request and response
      await createStudent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student already exists' });
    });
  
    // ... additional tests for other validation failures
  });

  // Tests for updateStudent
  describe('updateStudent', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful update
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

      // Call the function with the mock request and response
      await updateStudent(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
    }
  )}
  );

  // Tests for deleteStudent
  describe('deleteStudent', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful deletion
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

      // Call the function with the mock request and response
      await deleteStudent(req, res);
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
