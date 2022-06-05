const produit = require('../models/produit');
const user = require('../models/user');
const Categorie = require('../models/categorie')
const reservation = require('../models/reservation')
const fs = require('fs')
const bcrypt = require('bcryptjs');

const Ajouter = async (req, res) => {
    const { title, qte, deadline, type,forme, category, userid } = req.body;
    
    console.log(req.body);
    let Newproduit;
    if (type === 'Medicament'){
        Newproduit = new produit({
            title,
            qte,
            deadline,
            type,
            forme,
            category,
            userid,
            image: req.file.filename,
            etat:true, 
            qte_initial:qte
        });
    } else{
        Newproduit = new produit({
            title,
            qte,
            deadline: null,
            type,
            forme: null,
            category,
            userid,
            image: req.file.filename,
            etat:true, 
            qte_initial:qte
        });

    }

    let existinguser;

    try {
        existinguser = await user.findById(userid);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong find ", data: error});
    }

    let existingcategorie;

    try{
        existingcategorie = await Categorie.findById(category)        
    }catch(error){
        return res.status(400).json({message: "something is wrong with the DB", error: error});
    }

    try {
        await Newproduit.save();
        existingcategorie.produits.push(Newproduit);
        await existingcategorie.save();
        existinguser.medicaments.push(Newproduit);
        await existinguser.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(201).json({success: true, message: "success", data: Newproduit});
}

const GetAll = async (req, res) => {

    let existingproduit;
    try {
        existingproduit = await produit.find();
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }

    return res.status(200).json({message: "success", data: existingproduit});

}

const categorie = async(req, res) => {

    const { categorie_id  } = req.body;

    let existingcategories;
    try {
        existingcategories = await Categorie.findById(categorie_id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingcategories) {
        return res.status(405).json({success: false, message: "categorie Doesn't Exist!!"})
    }

    let existingProduit;
    try {
        // existingProduit = await produit.find(existingcategories.produits);
        existingProduit = await produit.find({'_id': { $in: existingcategories.produits}});
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    if (!existingProduit) {
        return res.status(405).json({success: false, message: "produit Doesn't Exist!!"})
    }

    
    return res.status(200).json({success: true, message: "success", data: existingProduit});

}

const FindById = async(req, res) => {

    const { id } = req.params;

    let existingproduit;
    try {
        existingproduit = await produit.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingproduit) {
        return res.status(405).json({success: false, message: "produit Doesn't Exist!!"})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingproduit});

}

const getUserMedics = async(req, res) => {

    const { id } = req.body;

    let existingproduit;
    try {
        existingproduit = await produit.find({userid : id});
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingproduit) {
        return res.status(405).json({success: false, message: "No Donation Found!"})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingproduit});

}

const getUserReservations = async(req, res) => {

    const { id } = req.body;

    let existingreservation;
    try {
        existingreservation = await reservation.find({iduser : id});
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingreservation) {
        return res.status(405).json({success: false, message: "No Reservation Found!"})
    }

    return res.status(200).json({success: true, message: "success", data: existingreservation});

}

const Delete = async(req, res) => {

    const { id } = req.params;

    let existingproduit;
    try {
        existingproduit = await produit.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    let path = `./uploads/images/${existingproduit.image}`;
    try {
        fs.unlinkSync(path)
        //file removed
    } catch(error) {
        console.log(error);
        return res.status(200).json({success: false, message: error, error: error})
    }
    
    if (!existingproduit) {
        return res.status(405).json({success: false, message: "produit Doesn't Exist!!"})
    }
    
    try {
        await existingproduit.remove();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({success: true, message: "deleted succesfully"});

}

const updateproduit = async(req, res) => {

    const { title, qte, deadline, type,forme, category } = req.body;

    const { id } = req.params;

    let existingproduit;
    try {
        existingproduit = await produit.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB in finding", error: error})
    }
    
    if (!existingproduit) {
        return res.status(405).json({success: false, message: "produit n'est pas existe!!"})
    }
    
    existingproduit.title = title;
    existingproduit.type = type;
    existingproduit.forme = forme;
    existingproduit.deadline = deadline;
    existingproduit.category = category;
    if (req.file){
        existingproduit.image = req.file.filename;
    }
    existingproduit.qte = qte;

    try {
        await existingproduit.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "something went wrong with DB in saving", error: error})
    }
    
    return res.status(201).json({success: true, message: "Produit modifié avec succès ", data: existingproduit});

}

exports.Ajouter = Ajouter 
exports.GetAll = GetAll 
exports.FindById = FindById 
exports.Delete = Delete 
exports.updateproduit = updateproduit 
exports.getUserMedics = getUserMedics 
exports.categorie = categorie
exports.getUserReservations = getUserReservations
