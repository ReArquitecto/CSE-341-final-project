// courses.test.js
const {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse
  } = require('./courses');
  const mongodb = require('../db/connect');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const ObjectId = require('mongodb').ObjectId;

  // Mock course data
  const mockCoursesData = [
    {
      _id: new ObjectId(),
      department: "CS",
      code: "101",
      name: "Introduction to Computer Science",
      description: "An introductory course on computer science.",
      creditHours: 3,
      prerequisites: "None"
    },
    {
        _id: new ObjectId(),
        department: "ART",
        code: "130",
        name: "Introduction to Art",
        description: "An introductory course on Art.",
        creditHours: 3,
        prerequisites: "None"
      },
      {
        _id: new ObjectId(),
        department: "CSE",
        code: "341",
        name: "Web Services",
        description: "An introductory course on Web Services.",
        creditHours: 3,
        prerequisites: "None"
    }
    // Add more mock courses as needed
  ];

  const mockCourseId = new ObjectId();

  // Mock request and response objects
  const req = {
    params: { id: mockCourseId },
    body: mockCoursesData   
  };

  let res = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  let mongoServer;

  // ALL TESTS FOR THE courses.js CONTROLLER
  describe('Course Controller', () => {
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
    // TESTS FOR getAllCourses
    // ✏️ Successful getAllCourses
    test('getAllCourses should retrieve courses and return status 200', async () => {
      const mockToArray = jest.fn().mockResolvedValue(mockCoursesData);
      const mockFind = jest.fn().mockReturnThis();
      mongodb.initDb
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ 
          find: mockFind,
          toArray: mockToArray
        })
      });
       // Create a mock request object
    const req = {}; 

      await getAllCourses(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCoursesData);
    });

    //  getAllCourses error handling
    test('getAllCourses should return status 400 if error occurs', async () => {
      const mockToArray = jest.fn().mockRejectedValue(new Error('Mock error'));
      const mockFind = jest.fn().mockReturnThis();
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: mockFind,
          toArray: mockToArray
        })
      });

      await getAllCourses(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
    });

    // TESTS FOR getSingleCourse
    //  Successful getSingleCourse
    test('getSingleCourse should retrieve a course and return status 200', async () => {
      const mockFindOne = jest.fn().mockResolvedValue(mockCoursesData[0]);
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ findOne: mockFindOne })
      });
      const req = { params: { id: mockCoursesData[0]._id } };

      await getSingleCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCoursesData[0]);
    });

    // ✏️ getSingleCourse error handling
    test('getSingleCourse should return status 400 if error occurs', async () => {
      const mockFindOne = jest.fn().mockRejectedValue(new Error('Mock error'));
      mongodb.getDb = jest.fn().mockReturnValue({ collection: jest.fn().mockReturnValue({ findOne: mockFindOne }) });

      await getSingleCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Mock error' });
    });


    // TESTS FOR createCourse
    // ✏️ Successful createCourse
    test('should create a course and return 201 status', async () => {
      const req = {
        body: {
          department: "CSE",
          code: "102",
          name: "Data Structures",
          description: "A course on data structures.",
          creditHours: "4",
          prerequisites: "CS101"
        }
      };

      const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: mockInsertOne
      });

      await createCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Course created successfully' });
    });

    // ✏️ Missing required fields
    test('should return 400 status if required fields are missing', async () => {
      const req = {
        body: {
          // Missing 'code' and other fields
          department: "CS",
          name: "Data Structures",
          description: "A course on data structures.",
          creditHours: "4",
          prerequisites: "CS101"
        }
      };

      const mockInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: mockInsertOne
      });

      await createCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    // ✏️ Course already exists
    test('should return 400 status if course already exists', async () => {
      const req = {
        body: {
          department: "CS",
          code: "101",
          name: "Introduction to Computer Science",
          description: "An introductory course on computer science.",
          creditHours: "4",
          prerequisites: "None"
        }
      };

      const mockFindOne = jest.fn().mockResolvedValue({ _id: 'existingId', ...req.body });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        findOne: mockFindOne
      });

      await createCourse(req, res);
      expect(res.status).toHaveBeenCalledWith(400);

    });


  // TESTS FOR updateCourse

  test('should update a course and return 201 status', async () => {
    const req = {
      params: { id: mockCoursesData[0]._id.toString() },
      body: {
        department: "CS",
        code: "101",
        name: "Introduction to Computer Science",
        description: "An introductory course on computer science.",
        creditHours: "3",
        prerequisites: "None"
      }
    };

      // Mock database methods
      const mockUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        updateOne: mockUpdateOne
      });

      await updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

  //  Unsuccessful updateCourse - Invalid ID
  test('should return 400 status if invalid course ID is provided for update', async () => {
    const req = {
      params: { id: 'invalidID' },
      body: {
        department: "CS",
        code: "101",
        name: "Introduction to Computer Science",
        description: "An introductory course on computer science.",
        creditHours: 3,
        prerequisites: "None"
      }
    };

    await updateCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✏️ Unsuccessful updateCourse - Missing required fields
  test('should return 400 status if required fields are missing for update', async () => {
    const req = {
      params: { id: mockCoursesData[0]._id.toString() },
      body: {
        // Missing 'name' and other fields
        department: "CS",
        code: "101",
        description: "An introductory course on computer science.",
        creditHours: 3,
        prerequisites: "None"
      }
    };

    await updateCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ✏️ Unsuccessful updateCourse - Course already exists
  test('should return 400 status if course already exists for update', async () => {
    const req = {
      params: { id: mockCoursesData[0]._id.toString() },
      body: {
        department: "CS",
        code: "102",
        name: "Data Structures",
        description: "A course on data structures.",
        creditHours: 4,
        prerequisites: "CS101"
      }
    };

    const mockFindOne = jest.fn().mockResolvedValue({ _id: 'existingId', ...req.body });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      findOne: mockFindOne
    });

    await updateCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

  });

  // TESTS FOR deleteCourse
  // ✏️ Successful deleteCourse
  test('should delete a course and return 200 status', async () => {
    const req = {
      params: { id: mockCoursesData[0]._id.toString() }
    };

    const mockDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: mockDeleteOne
    });

    await deleteCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Course deleted successfully' });
  });

  // ✏️ Unsuccessful deleteCourse - Invalid ID
  test('should return 400 status if invalid course ID is provided for delete', async () => {
    const req = {
      params: { id: 'invalidID' }
    };

    await deleteCourse(req, res);
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
