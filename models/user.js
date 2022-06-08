const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true },
    nom:{type: String, required: true },
    prenom:{type: String, required: true },
    tel:{type: Number, required: true },
    avatar:{type: String, required: true },
    password:{type: String, required: true},
    adresse:{type: String, required: true},
    role:{type: String, default: 'user'},
    medicaments:[{ type: mongoose.Types.ObjectId, ref: "produit" }],
    reservations:[{ type: mongoose.Types.ObjectId, ref: "reservation" }],
    donnations:[{ type: mongoose.Types.ObjectId, ref: "donnation" }],
})

module.exports = mongoose.model('user', UserSchema);