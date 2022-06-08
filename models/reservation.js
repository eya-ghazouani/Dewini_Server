const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    qte_reserv: {
        type:Number,
        required: true
    },
    date_reserv:{
        type:String,
        required: true
    },
    confirm:{
        type:Boolean,
        default: null
    },
    ordonnance:{
        type: String, 
        required: true
    },
    iduser:{ type: mongoose.Types.ObjectId, required: true, ref: "user" },
    idproduit:{ type: mongoose.Types.ObjectId, required: true, ref: "produit" },
});
module.exports = mongoose.model('reservation', reservationSchema);