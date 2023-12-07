const { getAllCourseInstances, getSingleCourseInstance, createCourseInstance, updateCourseInstance, deleteCourseInstance } = require('./course-instances');
const mongodb = require('../db/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;

// Mock course instances data
const mockCourseInstancesData = [
  {
    _id: new ObjectId(),
    courseId: "101",
    teacherId: "001",
    semester: "Spring",
    year: "2023",
    location: "Building A",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    schedule: "MWF",
    maxStudentCount: 30   
  },
  {
    _id: new ObjectId(),
    courseId: "103",
    teacherId: "003",
    semester: "Spring",
    year: "2023",
    location: "Building C",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    schedule: "TTF",
    maxStudentCount: 30
  },
  {
    _id: new ObjectId(),
    courseId: "103",
    teacherId: "003",
    semester: "Spring",
    year: "2023",
    location: "Building C",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    schedule: "MWF",
    maxStudentCount: 30
  },
  // Add more mock course instances as needed
];

const mockCourseInstanceId = new ObjectId();

// Mock request and response objects
const req = {
  params: { id: mockCourseInstanceId },
  body: mockCourseInstancesData
};

let res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};

let mongoServer;

// ALL TESTS FOR THE course-instances.js CONTROLLER
describe('Course Instance Controller', () => {
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

  // TESTS FOR getAllCourseInstances
  // Successful getAllCourseInstances
  test('getAllCourseInstances should retrieve course instances and return status 200', async () => {
    const mockToArray = jest.fn().mockResolvedValue(mockCourseInstancesData);
    const mockFind = jest.fn().mockReturnThis();
    mongodb.initDb
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({ 
        find: mockFind,
        toArray: mockToArray
      })
    });

    const req = {}; 

    await getAllCourseInstances(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCourseInstancesData);
  });

  // getAllCourseInstances error handling
  test('getAllCourseInstances should return status 400 if error occurs', async () => {
    const mockToArray = jest.fn().mockRejectedValue(new Error('Mock error'));
    const mockFind = jest.fn().mockReturnThis();
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: mockFind,
        toArray: mockToArray
      })
    });

    await getAllCourseInstances(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  // TESTS FOR getSingleCourseInstance
  // Successful getSingleCourseInstance
  test('getSingleCourseInstance should retrieve a course instance and return status 200', async () => {
    const mockFindOne = jest.fn().mockResolvedValue(mockCourseInstancesData[0]);
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({ findOne: mockFindOne })
    });
    const req = { params: { id: mockCourseInstancesData[0]._id } };
    
    await getSingleCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCourseInstancesData[0]);
  });

  // getSingleCourseInstance error handling
  test('getSingleCourseInstance should return status 400 if error occurs', async () => {
    const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
    mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });
    
    await getSingleCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
  });

  // TESTS FOR createCourseInstance
  //  NOT WORKING YET
  test('should create a course-instance and return status 201', async () => {
    const req = {
      body: {
        courseId: "102",
        teacherId: "002",
        semester: "Fall",
        year: "2023",
        location: "Building B",
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        schedule: "TTF",
        maxStudentCount: "25"
      }
    };
    
    // Mock database methods
    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(201); 
  });


  // Missing required fields
  test('should return 400 status if required fields are missing', async () => {
    const req = {
      body: {
        // Missing some required fields
        courseId: "103",
        teacherId: "003",
      }
    };

    const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: mockInsertOne
    });

    await createCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Course instance already exists
  test('should return 400 status if course-instance already exists', async () => {
    const req = {
      body: {
        courseId: "101",
        teacherId: "001",
        semester: "Spring",
        year: "2023",
        location: "Building A",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        schedule: "MWF",
        maxStudentCount: 30,
      }
    };

    const mockFindOne = jest.fn().mockResolvedValue({ _id: 'existingId', ...req.body });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: mockFindOne
    });

    await createCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
   
  });

  // TESTS FOR updateCourseInstance
  // Working
  test('should update a course instance and return status 200', async () => {
    const req = {
      params: { id: mockCourseInstancesData[0]._id.toString() },
      body: {
        courseId: "101",
        teacherId: "001",
        semester: "Spring",
        year: "2023",
        location: "Building A",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        schedule: "MWF",
        maxStudentCount: "30"   
      }
    };

    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      updateOne: mockUpdateOne
    });

    await updateCourseInstance(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
 
  });

  // Missing required fields
  test('should return 400 status if required fields are missing', async () => {
    const req = {
      params: { id: mockCourseInstancesData[0]._id.toString() },
      body: {
        // Missing some required fields
        courseId: "101",
        teacherId: "001",
      }
    };

    const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      updateOne: mockUpdateOne
    });

    await updateCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });



  // TESTS FOR deleteCourseInstance
  // Successful deleteCourseInstance
  test('should delete a course instance and return 200 status', async () => {
    const req = {
      params: { id: mockCourseInstancesData[0]._id.toString() }
    };

    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: mockDeleteOne
    });

    await deleteCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ acknowledged: true, insertedId: 'newId' });
  });

  // Invalid course instance ID for deletion
  test('should return 400 status if invalid course instance ID is provided for deletion', async () => {
    const req = {
      params: { id: 'invalidID' }
    };

    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: mockDeleteOne
    });

    await deleteCourseInstance(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Tests are finished. Close the connections.
  afterAll(async () => {
    await mongodb.closeDB();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
});
