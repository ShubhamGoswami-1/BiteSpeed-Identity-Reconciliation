const express = require("express");
const contactsController = require('./../Controllers/contactsController');
const router = express.Router();

router.route('/')
    .post(contactsController.createContact)
    .get(contactsController.getAllContacts);

module.exports = router; 