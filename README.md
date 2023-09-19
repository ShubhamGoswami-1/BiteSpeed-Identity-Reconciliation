# BiteSpeed_Assignment
Running in postman : 
GET : 127.0.0.1:3000/api/contacts/identify
POST : 127.0.0.1:3000/api/contacts/identify

Currently using the Cloud MongoDb database 

To run the project in you local changes  needed : 

1 - Update the connectionString in Server.js file with your cloud mongodb connection string of your cluster.

2 - Packages need to be installed - mongoose , Express


# **Bitespeed Needs Your Help!**

Bitespeed needs a way to identify and keep track of a customer's identity across multiple purchases.

We know that orders on FluxKart.com will always have either an **`email`** or **`phoneNumber`** in the checkout event.

Bitespeed keeps track of the collected contact information in a relational database table named **`Contact`.**
