const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Student Enrollment API',
    description: 'API Documentation for Student Enrollment API',
  },
  host: 'enrollment-system-0o9t.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// This will generate the swagger.json file
swaggerAutogen(outputFile, endpointsFiles, doc);
