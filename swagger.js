const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');

const doc = {
  info: {
    title: 'Student Enrollment API',
    description: 'API Documentation for Student Enrollment API',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  tags: [
    { name: 'Teachers', description: 'Operations related to Teachers' },
    { name: 'Courses', description: 'Operations related to Courses' },
    { name: 'Course-Instances', description: 'Operations related to Course Instances' },
    { name: 'Students', description: 'Operations related to Students' },
    { name: 'Enrollments', description: 'Operations related to Enrollments' },
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Function to process the swagger.json file
function processSwaggerFile() {
  fs.readFile(outputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the swagger.json file:', err);
      return;
    }

    let swaggerObj;
    try {
      swaggerObj = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing the swagger.json file:', parseErr);
      return;
    }

    // Remove paths with default response descriptions
    Object.keys(swaggerObj.paths).forEach(path => {
      const methods = swaggerObj.paths[path];
      Object.keys(methods).forEach(method => {
        const responses = methods[method].responses;
        if (responses && responses.default) {
          delete swaggerObj.paths[path];
        }
      });
    });

    fs.writeFile(outputFile, JSON.stringify(swaggerObj, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing the updated swagger.json file:', err);
      } else {
        console.log('Swagger file updated successfully.');
      }
    });
  });
}

// Generate the swagger.json file, then process it
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  processSwaggerFile();
});
