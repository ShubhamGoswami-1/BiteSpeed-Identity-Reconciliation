const express =require('express');
const morgan = require('morgan');
const contactRoutes = require('./Routes/contactRouter');
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/contacts/identify', contactRoutes);

module.exports = app;