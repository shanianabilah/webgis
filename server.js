require('dotenv').config();

const app = require('./app');

// Start server
const port = process.env.PORT;
app.listen(port, () => console.log('server running ...'))