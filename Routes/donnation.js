const express = require('express');
const donnationController = require('../Controllers/donnation');
const fileuploader = require('../MiddleWare/UploadFiles');
const route = express.Router();

route.post('/donate', donnationController.donate);

route.get('/', donnationController.GetAll);

route.patch('/reponse/:id', donnationController.Response);

route.get('/:id', donnationController.FindById);

route.patch('/:id', donnationController.updatedonnation);

route.delete('/:id', donnationController.Annuler);


module.exports = route