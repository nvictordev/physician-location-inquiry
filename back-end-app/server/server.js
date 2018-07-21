const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Contact} = require('./models/contact');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/search', (req, res) => {
  let nameFirst = new RegExp('alan', 'i');
  let nameLast = new RegExp('', 'i');
  let nameMiddle = new RegExp('', 'i');
  return Contact.find({
    Physician_First_Name: nameFirst,
    Physician_Middle_Name: nameMiddle,
    Physician_Last_Name: nameLast}, (err, results) => {
    return res.send(results.map((result) => {
      return {
        firstName: result.Physician_First_Name,
        middleName: result.Physician_Middle_Name,
        lastName: result.Physician_Last_Name,
        street: result.Recipient_Primary_Business_Street_Address_Line1,
        city: result.Recipient_City,
        state: result.Recipient_State,
        zipCode: result.Recipient_Zip_Code
      }
    }));
  });
});
app.use((req, res, next) => {
  res.status(404).send('<h2 align=center> Page Not Found!</h2>');
});

app.listen(5001, () => {
  console.log('port 5001 starts')
});