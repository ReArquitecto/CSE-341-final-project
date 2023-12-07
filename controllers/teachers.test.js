// Teachers.test.js
const { getAllTeachers, getSingleTeacher, createTeacher, updateTeacher, deleteTeacher } = require('./teachers');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;

// Mock Teacher data
const mockTeacherData = [
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
  body: mockTeacherData
};

const res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

describe('Teacher Controller', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongodb.connect = jest.fn().mockResolvedValue(mongoServer.getUri());
  });

  // Tests for getAllTeachers
test('getAllTeachers should retrieve Teachers and return status 200', async () => {
  // Mock the chaining of find().toArray()
  const mockToArray = jest.fn().mockResolvedValue(mockTeachersData);
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
  await getAllTeachers(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockTeachersData);
});

  test('getAllTeachers should return status 400 if error occurs', async () => {
    // Mock db.collection.find().toArray()
    const mockFind = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ find: mockFind }) });

    await getAllTeachers(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  test('getSingleTeacher should retrieve a single Teacher and return status 200', async () => {
    // Create a mock req and a mock FindOne function
    const req = { params: { id: mockTeachersData[0]._id.toString() } };
    const mockFindOne = jest.fn().mockImplementation(({ _id }) => {
      const teacher = mockTeachersData.find(teacher => teacher._id.toString() === _id);
      return Promise.resolve(teacher);
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
    await getSingleTeacher(req, res);
    expect(mockFindOne).toHaveBeenCalledWith({ _id: new ObjectId(mockTeachersData[0]._id) });
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


  // Tests for createTeacher
  describe('createTeacher', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful creation
    test('should create a Teacher and return 200 status', async () => {
      const req = {
        body: {
            firstName: "Mary",
            lastName: "Jean",
            email: "MaryJean@gmail.com",
            address: "222 Pants Ave, Rexburg",
            phoneNumber: "4445556666",
            subject: "Computer Science"
        }
      };
      
      // Mock database methods
      const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue(null), // Simulate that the Teacher doesn't already exist
        insertOne: mockInsertOne
      });
  
      // Call the function with the mock request and response
      await createTeacher(req, res);
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
      await createTeacher(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });
  
    // Teacher already exists
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
  
      // Call the function with the mock request and response
      await createTeacher(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Teacher already exists' });
    });
  
    // ... additional tests for other validation failures
  });

  // Tests for updateTeacher
  describe('updateTeacher', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful update
    test('should update a Teacher and return 200 status', async () => {
      const req = {
        params: { id: mockTeachersData[0]._id.toString() },
        body: {
            firstName: "Mark",
            lastName: "Smith",
            email: "ms@gmail.com",
            address: "123 Carrot Lane, Rexburg",
            phoneNumber: "1112223333",
            subject: "Art"
        }
      };

      // Mock database methods
      const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        updateOne: mockUpdateOne
      });

      // Call the function with the mock request and response
      await updateTeacher(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
    }
  )}
  );

  // Tests for deleteTeacher
  describe('deleteTeacher', () => {
    // Before each test, reset the mock for res
    beforeEach(() => {
      res.setHeader.mockClear();
      res.status.mockClear();
      res.json.mockClear();
    });
  
    // Successful deletion
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

      // Call the function with the mock request and response
      await deleteTeacher(req, res);
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
