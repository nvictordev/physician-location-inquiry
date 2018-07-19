const mongoose = require('mongoose');

const Contact = mongoose.model('Contact', {
  Physician_First_Name: {
    type: String,
    required: true,
    minlength: 1
  },
  Physician_Middle_Name: {
    type: String,
    minlength: 1 
  },
  Physician_Last_Name: {
    type: String,
    required: true,
    minlength: 1
  }
});

module.exports = {Contact};