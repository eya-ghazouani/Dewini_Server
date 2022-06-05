const user = require('../models/user');
const produit = require('../models/produit');
const reservation = require('../models/reservation');
const { utc } = require('moment');


const statsCars = async (req, res) => {
    
    let users;
    try {
        users = await user.find();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    let medicaments
    try {
        medicaments = await produit.find({type: 'Medicament' });
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }
   
    let parameds
    try {
        parameds = await produit.find({type: 'Produit Paramedical'});
    } catch (error) {
        return res.status(500).json({message: "something went wrong with DB", error: error})
    }

    let reservations;
    try {
        reservations= await reservation.find();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    return res.status(200).json({success: true, message: "success", data: {users: users.length, medics: medicaments.length , paramedics: parameds.length , reservs: reservations.length }});
    
    
}


const statsLine = async (req, res) => {
    
    let dates;
    try {
        dates = await reservation.aggregate().group({ _id: "$date_reserv", status_count: {$sum: 1} });
    } catch (error) {
        return res.status(500).json({success: false, message: error._message});
    }

    let line = [];

    dates.forEach(({_id, status_count}) => {
        line.push({date: _id, reservation: status_count})
    });
    
    return res.status(200).json({success: true, message: "success", data: line});
}


exports.statsCars = statsCars ;
exports.statsLine = statsLine ;