const express = require('express');
const statsController = require('../Controllers/stats');
const route = express.Router();

route.get('/', statsController.statsCars);

route.get('/line', statsController.statsLine);


module.exports = route