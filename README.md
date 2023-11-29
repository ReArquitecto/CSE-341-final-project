# Node Contacts API
Check out the site for this project at https://enrollment-system-0o9t.onrender.com
## Instructions for local development:
- add environment variables to .env file
- change swaggger.js to point to localhost and the schema to http
- node swagger.js
- npm install
- npm install --global nodemon
- nodemon start
- open http://localhost:8080

## Before pushing to github:
- remove default swagger paths to clean up the swagger docs
- change swagger.js to point to the render url and the schema to https
- node swagger.js
- npm run lint
- npm run prettier

## Database collections
- course-instances
- courses
- enrollments
- students
- teachers