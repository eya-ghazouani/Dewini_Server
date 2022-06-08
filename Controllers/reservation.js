const reservation = require('../models/reservation');
const produit = require('../models/produit');
const user = require('../models/user');
const moment = require('moment')

const GetAll = async (req, res) => {

    let existingreservation;
    try {
        existingreservation= await reservation.find();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    res.status(200).json({success: true, message: "success", data: existingreservation});
}

const Reservation = async(req, res) =>{
    const { qte_reserv  , iduser, idproduit, confirm} = req.body;
    
    let date_reserv = moment(new Date()).format('DD-MM-YYYY');
    const NewReservation= new reservation({
        qte_reserv,
        date_reserv,
        idproduit,
        iduser,
        confirm,
        ordonnance: req.file.filename,
    });

    let existingproduit;
    try {
        existingproduit = await produit.findById(idproduit);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong find ", data: error});
    }

    // existingproduit.qte_initial= existingproduit.qte

    if(existingproduit.qte < qte_reserv){
        return res.status(200).json({success: false, message: "Cette quantité n'est pas disponible"})
    }
    existingproduit.qte = existingproduit.qte - qte_reserv;

    let existinguser;
    try {
        existinguser = await user.findById(iduser);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong find ", data: error});
    }


    try {
        await NewReservation.save();
        await existingproduit.save();
        existinguser.reservations.push(NewReservation);
        await existinguser.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(201).json({success: true, message: "Reservation effectué, attendez la confirmation", data: NewReservation});

}

const Response = async(req, res) => {

    const { confirm } = req.body;
    const { id } = req.params;

    let existingreservation;
    try {
        existingreservation = await reservation.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingreservation) {
        return res.status(405).json({success: false, message: "reservation Doesn't Exist!!"})
    }

    existingreservation.confirm = confirm;

    try {
        await existingreservation.save();
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingreservation});

}

const FindById = async(req, res) => {

    const { id } = req.params;

    let existingreservation;
    try {
        existingreservation = await reservation.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingreservation) {
        return res.status(405).json({success: false, message: "reservation Doesn't Exist!!"})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingreservation});

}

const updatereservation = async(req, res) => {

    const { qte_reserv } = req.body;
    const { id } = req.params;

    let existingreservation;
    try {
        existingreservation = await reservation.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding ", error: error})
    }
          
    if (!existingreservation) {
        return res.status(405).json({success: false, message: "reservation Doesn't Exist!!"})
    }

    let existingproduit;
    try {
        existingproduit = await produit.findById(existingreservation.idproduit);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding", error: error})
    }

    // existingproduit.qte = existingproduit.qte_initial;
    let all = existingproduit.qte + existingreservation.qte_reserv;

    if(all < qte_reserv){
        // existingproduit.qte = existingproduit.qte - qte_reserv
        return res.status(405).json({success: false, message: "Cette quantité n'est pas disponible"})
    }

    existingreservation.qte_reserv = qte_reserv;

    existingproduit.qte = all - qte_reserv;

    if (req.file){
        existingreservation.ordonnance = req.file.filename;
    }

    try {
        await existingproduit.save();
        await existingreservation.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "something went wrong with DB in saving", error: error})
    }
    
    return res.status(201).json({success: true, message: "Reservation modifié avec succès ", data: existingreservation});

}

const Annuler = async(req, res) => {

    const { id } = req.params;

    let existingreservation;
    try {
        existingreservation = await reservation.findById(id);
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
    
    if (!existingreservation) {
        return res.status(405).json({message: "reservation Doesn't Exist!!"})
    }

    let existingproduit;
    try {
        existingproduit = await produit.findById(existingreservation.idproduit);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding", error: error})
    }
     
     existingproduit.qte =  existingproduit.qte + existingreservation.qte_reserv
    
    try {
        await existingproduit.save();
        await existingreservation.remove();
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({message: "Réservation annulée"});

}

exports.Reservation = Reservation
exports.FindById= FindById
exports.updatereservation= updatereservation
exports.Annuler= Annuler
exports.GetAll= GetAll
exports.Response= Response

