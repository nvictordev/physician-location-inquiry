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
  },
  Recipient_Primary_Business_Street_Address_Line1: {},
  Recipient_City: {},
  Recipient_State: {},
  Recipient_Zip_Code: {}
});

module.exports = {Contact};