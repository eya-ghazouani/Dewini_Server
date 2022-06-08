const mongoose = require('mongoose');

const donnationSchema = new mongoose.Schema({
    qte_don: {
        type:Number,
        required: true
    },
    date_don:{
        type:String,
        required: true
    },
    confirm:{
        type:Boolean
    },

    iduser:{ type: mongoose.Types.ObjectId, required: true, ref: "user" },
    idproduit:{ type: mongoose.Types.ObjectId, required: true, ref: "produit" },
});
module.exports = mongoose.model('donnation', donnationSchema);