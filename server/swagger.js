const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'ECOM API',
        description: 'API documentation for the application',
    },
    host: 'localhost:5000',
    basePath: '/api/',
    schemas: [
        "http"
    ],
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your bearer token in the format **Bearer &lt;token&gt;**',
        },
    },
};
const output = "./swagger.json";
const endRoute = [
    "./routes/auth.js",
    "./routes/product.js",
    "./routes/category.js",
    "./routes/uploadRoutes.js",
    "./routes/admin.js",
    "./routes/user.js"
];
swaggerAutogen(output, endRoute, doc);