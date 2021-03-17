var mongoose = require('mongoose');

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true 
 };

const URI_BDD = `mongodb+srv://admin:admin@cluster0.x7zy0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(URI_BDD,
  options,
  function (err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database Faceless connection : Success ***');
    }
  }
);

module.exports = mongoose

