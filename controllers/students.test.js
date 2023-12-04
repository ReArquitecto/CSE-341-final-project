/* 
########## Mock Data ########## 
*/


// Mock request object
const mongodb = require('../db/connect');
mongodb.getDb = jest.fn().mockReturnValue({
  collection: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  toArray: jest.fn().mockResolvedValue([/* mock student data */]),
  findOne: jest.fn().mockResolvedValue(/* mock student data */),
  // ... other mocked methods
});

// Mock response object
const res = {
  setHeader: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn()
};




/* 
########## Unit Tests ########## 
*/



const { getAllStudents } = require('./students');

describe('getAllStudents', () => {
  test('should get all students and return status 200', async () => {
    const req = {}; // Mock request object as needed
    await getAllStudents(req, res);
    expect(mongodb.getDb().collection).toHaveBeenCalledWith('students');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([/* expected student data */]);
  });

  test('should handle errors and return status 400', async () => {
    // Force the mock to reject to simulate a database error
    mongodb.getDb().collection().find().toArray.mockRejectedValue(new Error('Error occurred'));

    const req = {}; // Mock request object as needed
    await getAllStudents(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Error occurred', 
      error: 'Error occurred',
    });
  });
});
