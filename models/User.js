const mongoose = require('mongoose');
require('mongoose-type-email');

const userSchema = new mongoose.Schema({
    name : String,
    userId : String,
    emailId : mongoose.SchemaTypes.Email,
    password : String
});

const Users = mongoose. model('Users', userSchema);

module.exports = Users;