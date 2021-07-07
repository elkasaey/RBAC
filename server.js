const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
}
//Swagger Configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:'RBAC API',
      version:'1.0.0'
    },
  },
  apis: ['./app/routes/*.js'], // files containing annotations as above
};
const swaggerDocs = swaggerJSDoc(options);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "hello world!!" });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

//swagger route
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
