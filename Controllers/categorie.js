const categorie = require('../models/categorie');
const fs = require('fs')

const GetAll = async (req, res) => {

    let existingcategorie;
    try {
        existingcategorie= await categorie.find();
    } catch (error) {
        res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    res.status(200).json({success: true, message: "success", data: existingcategorie});
}

const Ajouter = async (req, res) => {
    const { nom } = req.body;

    let image = 'avaatar.png';
    if (req.file) {
        image = req.file.filename;
    }

    const NewCategorie = new categorie({
        nom,
        image
    });

    try {
        await NewCategorie.save();
    } catch (error) {
        res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    res.status(201).json({success: true, message: "Catégorie ajoutée avec succès", data: NewCategorie});
}

const FindById = async(req, res) => {

    const { id } = req.params;

    let existingcategorie;
    try {
        existingcategorie = await categorie.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingcategorie) {
        return res.status(405).json({success: false, message: "Category Doesn't Exist!!"})
    }
    
    return res.status(200).json({success: true, message: "success", data: existingcategorie});

}

const Delete = async(req, res) => {

    const { id } = req.params;

    let existingcategorie;
    try {
        existingcategorie = await categorie.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingcategorie) {
        return res.status(200).json({success: false, message: "Category Doesn't Exist!!"})
    }
    
    let path = `./uploads/images/${existingcategorie.image}`;
    try {
        fs.unlinkSync(path)
        //file removed
    } catch(error) {
        console.log(error);
        return res.status(200).json({success: false, message: error, error: error})
    }

    try {
        await existingcategorie.remove();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({success: true, message: "deleted succesfully"});

}

const updatecategorie = async(req, res) => {

    const { nom } = req.body;
    const { id } = req.params;

    let existingcategorie;
    try {
        existingcategorie = await categorie.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existingcategorie) {
        return res.status(405).json({success: false, message: "Category Doesn't Exist!!"})
    }
    
    existingcategorie.nom = nom;

    if (req.file) {
        existingcategorie.image = req.file.filename;
    }
        

    try {
        await existingcategorie.save();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(201).json({success: true, message: "Catégorie modifiée avec succés", data: existingcategorie});

}

exports.Ajouter = Ajouter;
exports.GetAll= GetAll;
exports.FindById=FindById;
exports.Delete=Delete;
exports.updatecategorie = updatecategorie;

