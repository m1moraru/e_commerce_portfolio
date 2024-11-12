// swaggerConfig.js
//const swaggerJsDoc = require('swagger-jsdoc');

//const swaggerOptions = {
//swaggerDefinition: {
//openapi: '3.0.0',
//// info: {
//      title: 'E-commerce API',
//      version: '1.0.0',
//     description: 'API documentation for the e_commerce_portfolio application',
//    },
//    servers: [
//      {
//       url: 'http://localhost:3000', // Adjust to your server settings
//      },
//    ],
//  },
//  apis: ['./routes/*.js'], // Point to where your routes are defined
//};

//const swaggerDocs = swaggerJsDoc(swaggerOptions);
//module.exports = swaggerDocs;

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
      description: 'API documentation for e_commerce_portfolio',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [], // Add any additional files here if necessary
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerConfig = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

// Cart Endpoints
options.definition.paths = {
  '/cart/add-item': {
    post: {
      summary: 'Add an item to a cart',
      tags: ['Cart'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cartId: { type: 'integer', description: 'ID of the cart' },
                itemId: { type: 'integer', description: 'ID of the item' },
                quantity: { type: 'integer', description: 'Quantity of the item' },
              },
              required: ['cartId', 'itemId', 'quantity'],
            },
          },
        },
      },
      responses: {
        200: { description: 'Item added successfully' },
        404: { description: 'Cart or item not found' },
        500: { description: 'Server error' },
      },
    },
  },
  '/cart/{cartId}/items/{itemId}': {
    delete: {
      summary: 'Remove an item from a cart',
      tags: ['Cart'],
      parameters: [
        { name: 'cartId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the cart' },
        { name: 'itemId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the item to remove' },
      ],
      responses: {
        200: { description: 'Item removed successfully' },
        404: { description: 'Cart or item not found' },
        500: { description: 'Server error' },
      },
    },
  },
  '/checkout/{cartId}': {
    post: {
      summary: 'Checkout cart items and create an order',
      tags: ['Checkout'],
      parameters: [
        {
          name: 'cartId',
          in: 'path',
          required: true,
          description: 'ID of the cart to checkout',
          schema: {
            type: 'integer',
          },
        },
      ],
      responses: {
        200: {
          description: 'Checkout successful, order created',
        },
        404: {
          description: 'Cart not found',
        },
        400: {
          description: 'Cart is empty',
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },

  // Order Endpoints
  '/orders': {
    post: {
      summary: 'Create a new order',
      tags: ['Order'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: { type: 'integer', description: 'ID of the user' },
                items: { type: 'array', items: { type: 'integer' }, description: 'List of item IDs' },
              },
              required: ['userId', 'items'],
            },
          },
        },
      },
      responses: {
        201: { description: 'Order created successfully' },
        400: { description: 'Invalid input' },
        500: { description: 'Server error' },
      },
    },
    get: {
      summary: 'Get all orders',
      tags: ['Order'],
      responses: {
        200: { description: 'List of orders' },
        500: { description: 'Server error' },
      },
    },
  },

  // Product Endpoints
  '/products': {
    get: {
      summary: 'Get all products',
      tags: ['Product'],
      responses: {
        200: { description: 'List of products' },
        500: { description: 'Server error' },
      },
    },
  },
  '/products/{productId}': {
    get: {
      summary: 'Get a specific product by ID',
      tags: ['Product'],
      parameters: [
        { name: 'productId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product' },
      ],
      responses: {
        200: { description: 'Product details' },
        404: { description: 'Product not found' },
        500: { description: 'Server error' },
      },
    },
  },

  // User Endpoints
  '/users': {
    post: {
      summary: 'Create a new user',
      tags: ['User'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string', description: 'Username of the user' },
                password: { type: 'string', description: 'Password of the user' },
              },
              required: ['username', 'password'],
            },
          },
        },
      },
      responses: {
        201: { description: 'User created successfully' },
        400: { description: 'Invalid input' },
        500: { description: 'Server error' },
      },
    },
    get: {
      summary: 'Get all users',
      tags: ['User'],
      responses: {
        200: { description: 'List of users' },
        500: { description: 'Server error' },
      },
    },
  },
  '/users/{userId}': {
    get: {
      summary: 'Get a specific user by ID',
      tags: ['User'],
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the user' },
      ],
      responses: {
        200: { description: 'User details' },
        404: { description: 'User not found' },
        500: { description: 'Server error' },
      },
    },
    put: {
      summary: 'Update a specific user by ID',
      tags: ['User'],
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the user' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: { type: 'string', description: 'New username' },
                password: { type: 'string', description: 'New password' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'User updated successfully' },
        404: { description: 'User not found' },
        500: { description: 'Server error' },
      },
    },
    delete: {
      summary: 'Delete a specific user by ID',
      tags: ['User'],
      parameters: [
        { name: 'userId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the user' },
      ],
      responses: {
        200: { description: 'User deleted successfully' },
        404: { description: 'User not found' },
        500: { description: 'Server error' },
      },
    },
  },
};

module.exports = swaggerConfig;
