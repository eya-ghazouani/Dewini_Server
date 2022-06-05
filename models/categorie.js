const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({

    nom: {
        type:String,
        required: true
    },
    image:{
        type: String
    },
    produits:[{type: mongoose.Types.ObjectId, required:true, ref:"produit"}]
});

module.exports = mongoose.model('categorie', categorieSchema);