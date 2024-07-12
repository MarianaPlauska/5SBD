const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('.routes/');
const { sequelize } = require('./models');

app.use(bodyParser.json());
app.use('/api', routes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
