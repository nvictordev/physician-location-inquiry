const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Contact} = require('./models/contact');

const app = express();
app.use(cors())
app.use(bodyParser.json());

const titleCase = (str) => {
  lowerStr = str.toLowerCase().split('');
  for (var i = 0; i < lowerStr.length; i++) {
    lowerStr[0] = lowerStr[0].toUpperCase();
    word = lowerStr.join('');
  }
  return word;
};

app.get('/search', (req, res) => {
  let nameFirst = { $regex: `^${req.query.firstName}`, $options: 'i' };
  let nameMiddle = { $regex: `^${req.query.middleName}`, $options: 'i' };
  let nameLast = { $regex: `^${req.query.lastName}`, $options: 'i' };
  return Contact.find({
    Physician_First_Name: nameFirst,
    Physician_Middle_Name: nameMiddle,
    Physician_Last_Name: nameLast}, (err, results) => {
      if (results) {
        return res.send(results.map((result) => {
          let firstName = titleCase(result.Physician_First_Name);
          let middleName = titleCase(result.Physician_Middle_Name);
          let lastName = titleCase(result.Physician_Last_Name);
          return {
            firstName,
            middleName,
            lastName
          }
        }));
      } else {
        return res.status(404).send(err);
      }
  });
});
app.get('/address', (req, res) => {
  let nameFirst = new RegExp(req.query.firstName, 'i');
  let nameMiddle = new RegExp(req.query.middleName, 'i');
  let nameLast = new RegExp(req.query.lastName, 'i');
  return Contact.findOne({
    Physician_First_Name: nameFirst,
    Physician_Middle_Name: nameMiddle,
    Physician_Last_Name: nameLast
  }, (err, result) => {
    if (results) {
      return res.send({
        street: result.Recipient_Primary_Business_Street_Address_Line1,
        city: result. Recipient_City,
        state: result.Recipient_State,
        zipCode: result.Recipient_Zip_Code
      });
    } else if (err) {
      return res.status(404).send(err);
    }
  });
});

app.use((req, res, next) => {
  res.status(404).send('<h2 align=center> Page Not Found!</h2>');
});

app.listen(5001, () => {
  console.log('port 5001 starts')
});