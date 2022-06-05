const express = require('express');
const produitController = require('../Controllers/produit');
const fileuploader = require('../MiddleWare/UploadFiles');
const route = express.Router();

route.get('/', produitController.GetAll);

route.post('/', produitController.getUserMedics);

route.post('/reservation', produitController.getUserReservations);

route.get('/:id', produitController.FindById);

route.patch('/:id', fileuploader.single('image'), produitController.updateproduit);

route.delete('/:id', produitController.Delete);

route.post('/add', fileuploader.single('image'), produitController.Ajouter);

route.post('/categorie', produitController.categorie);



module.exports = route