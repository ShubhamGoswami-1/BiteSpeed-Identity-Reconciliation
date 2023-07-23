
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const mongoose = require('mongoose');

// process.on('uncaughtException', (err) => {
//     console.log(err.name, err.message);
//     console.log("Uncaught Exception occured!, Shutting down... :(");

//     process.exit(1);
// });

const app = require('./app');

mongoose.connect(process.env.CONN_STR, {
    UseNewUrlParser: true
}).then((conn) => {
    console.log("DB Connection Successful ! :)");
})

const server = app.listen(3000, () => {
    console.log("Server running on 3000...");
});

// process.on('unhandledRejection', (err) => {
//     console.log(err.name, err.message);
//     console.log("Unhandled Rejection occured! Shutting down... :(")
    
//     server.close(() => {
//         process.exit(1);
//     });
// });

