const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [{ url: 'http://localhost:3500' }],
  },
  apis: ['./routes/*.js'], // files containing your JSDoc comments
};

module.exports = swaggerJsdoc(options);