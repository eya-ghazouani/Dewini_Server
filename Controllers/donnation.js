const donnation = require('../models/donnation');
const produit = require('../models/produit');
const user = require('../models/user');
const moment = require('moment')

const GetAll = async (req, res) => {

    let existingdonnation;
    try {
        existingdonnation= await donnation.find();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    res.status(200).json({success: true, message: "success", data: existingdonnation});
}

const donate = async(req, res) =>{
    const { qte_don  , iduser, idproduit} = req.body;
    
    let date_don = moment(new Date()).format('DD-MM-YYYY');
    const Newdonnation= new donnation({
        qte_don,
        date_don,
        idproduit,
        iduser,
        confirm: null,
    });

    let existingproduit;
    try {
        existingproduit = await produit.findById(idproduit);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong find ", data: error});
    }

    // existingproduit.qte_initial= existingproduit.qte

    // if(existingproduit.qte < qte_don){
    //     return res.status(200).json({success: false, message: "Cette quantité n'est pas disponible"})
    // }
    // existingproduit.qte = existingproduit.qte - qte_don;

    let existinguser;
    try {
        existinguser = await user.findById(iduser);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong find ", data: error});
    }


    try {
        await Newdonnation.save();
        await existingproduit.save();
        existinguser.donnations.push(Newdonnation);
        await existinguser.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(201).json({success: true, message: "donnation effectué, attendez la confirmation", data: Newdonnation});

}

const Response = async(req, res) => {

    const { confirm } = req.body;
    const { id } = req.params;

    let existingdonnation;
    try {
        existingdonnation = await donnation.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingdonnation) {
        return res.status(200).json({success: false, message: "donnation Doesn't Exist!!"})
    }

    existingdonnation.confirm = confirm;

    try {
        await existingdonnation.save();
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingdonnation});

}

const FindById = async(req, res) => {

    const { id } = req.params;

    let existingdonnation;
    try {
        existingdonnation = await donnation.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingdonnation) {
        return res.status(405).json({success: false, message: "donnation Doesn't Exist!!"})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingdonnation});

}

const updatedonnation = async(req, res) => {

    const { qte_don } = req.body;
    const { id } = req.params;

    let existingdonnation;
    try {
        existingdonnation = await donnation.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding ", error: error})
    }
          
    if (!existingdonnation) {
        return res.status(200).json({success: false, message: "donnation Doesn't Exist!!"})
    }

    let existingproduit;
    try {
        existingproduit = await produit.findById(existingdonnation.idproduit);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding", error: error})
    }

    // existingproduit.qte = existingproduit.qte_initial;
    let all = existingproduit.qte + existingdonnation.qte_reserv;

    if(all < qte_don){
        // existingproduit.qte = existingproduit.qte - qte_reserv
        return res.status(405).json({success: false, message: "Cette quantité n'est pas disponible"})
    }

    existingdonnation.qte_don = qte_don;

    existingproduit.qte = all - qte_don;

    if (req.file){
        existingdonnation.ordonnance = req.file.filename;
    }

    try {
        await existingproduit.save();
        await existingdonnation.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "something went wrong with DB in saving", error: error})
    }
    
    return res.status(201).json({success: true, message: "donnation modifié avec succès ", data: existingdonnation});

}

const Annuler = async(req, res) => {

    const { id } = req.params;

    let existingdonnation;
    try {
        existingdonnation = await donnation.findById(id);
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
    
    if (!existingdonnation) {
        return res.status(200).json({message: "donnation Doesn't Exist!!"})
    }

    let existingproduit;
    try {
        existingproduit = await produit.findById(existingdonnation.idproduit);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding", error: error})
    }
     
     existingproduit.qte =  existingproduit.qte + existingdonnation.qte_don
    
    try {
        await existingproduit.save();
        await existingdonnation.remove();
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({message: "Réservation annulée"});

}

exports.donate = donate
exports.FindById= FindById
exports.updatedonnation= updatedonnation
exports.Annuler= Annuler
exports.GetAll= GetAll
exports.Response= Response

