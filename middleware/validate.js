const validator = new require('../helpers/validate');

const saveCourse = (req, res, next) => {
  const validationRule = {
    department: 'required|string',
    code: 'required|integer',
    name: 'required|string',
    description: 'required|string', 
    creditHours: 'required|integer',
    prerequisites: 'required|string',
   
  };
 
  
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};




const saveCourseInstance = (req, res, next) => {
  const validationRule = {
    courseId: 'required|integer',
    teacherId: 'required|string', 
    semester:'required|string',
    year: 'required|integer|digits:4',
    location:'required|string',
    startTime:'required|string',
    endTime:'required|string',
    schedule:'required|string',
    maxStudentCount:'required|integer',

  };
  
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed for event',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveEnrollment = (req, res, next) => {
  const validationRule = {
   courseInstanceId: 'required|integer',
   studentId :'required|integer',

  };
  
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed for event',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveStudent = (req, res, next) => {
  const validationRule = {
   courseInstanceId: 'required|integer',
   studentId:'required|integer',
   firstName:'required|string', 
   lastName:'required|string', 
   email: 'required|email', 
   birthday: 'required|string', 
   gender:'required|string',
   address:'required|string', 
   phoneNumber:'required|integer'

  };
  
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed for event',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveTeacher = (req, res, next) => {
  const validationRule = {
    firstName:'required|string', 
    lastName:'required|string', 
    email: 'required|email', 
    address:'required|string', 
    phoneNumber:'required|integer',
    subject : 'required|string'
   
  };
 
  
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};
module.exports = {
  saveCourse,
  saveCourseInstance,
  saveEnrollment,
  saveStudent,
  saveTeacher
};