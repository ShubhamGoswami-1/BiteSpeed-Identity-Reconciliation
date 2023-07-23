const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    linkedId: {
        type: Number,
        default: null
    },
    accountStatus: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;