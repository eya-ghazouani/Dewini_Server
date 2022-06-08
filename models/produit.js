const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    title:{type: String, required: true},
    qte:{type: Number, },
    type:{type: String, },
    forme:{type: String},
    category :{ type: mongoose.Types.ObjectId, required: true, ref: "categorie" },
    deadline:{type: String},
    userid:{ type: mongoose.Types.ObjectId, required: true, ref: "user" },
    image:{type: String},
    etat:{type:Boolean},
    qte_initial:{type: Number},

})

module.exports = mongoose.model('produit', produitSchema);