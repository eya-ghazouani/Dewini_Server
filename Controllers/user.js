const user = require('../models/user');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const nodemailer = require("nodemailer");
const fs = require('fs')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tunisie.free.medicine@gmail.com', // generated ethereal user'
      pass: 'medicine123', // generated ethereal password
    },
});

const Ajouter = async (req, res) => {
    const { email, nom, prenom, adresse, tel } = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (existinguser) {
        return res.status(200).json({success: false, message: "Cet utilisateur déja existe!"})
    }

    console.log(req.body)
    let password = generator.generate({
        length: 10,
        numbers: true
    });

    hashedPass = await bcrypt.hash(password, 10);

    let avatar= 'avatar.png';
    if (req.file) {
        avatar= req.file.filename;
    }

    const NewUser = new user({
        email,
        password: hashedPass,
        nom, 
        prenom, 
        adresse, 
        tel,
        avatar,
    });

    try {
        await NewUser.save();
    } catch (error) {
        return res.status(200).json({success: false, message: error._message, error: error})
    }

    var mailOptions = {
        from: 'tunisie.free.medicine@gmail.com',
        to: email,
        subject: ' BienVenue Chez tunise medicie',
        text: ' BienVenue Chez tunisie medicine',

        html: `<h1 style="color: blue">Tunisie Medicine</h1>
            <h3 style="color: black">Account Management</h3>
            <b style="color: black"> Mr(s) ${nom} ${prenom} you are welcome to use our App. and here's your credintials:<h3> votre email:</h3></b>
            <h3 style="color: #1155CC " ><u>${email}</u></h3>
            <h3 style="color: black"> Et Votre Mot de Passe est: </h3>
            <h3 style="color: #1155CC " >${password}</h3>`,
    };
  
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    
    return res.status(201).json({success: true, message: "Utilisateur ajouté avec succès", data: NewUser});
}

const Register = async (req, res) => {
    const { email, password, nom, prenom, adresse, tel, confirm_password } = req.body;

    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (existinguser) {
        return res.status(405).json({success: false, message: "Cet utilisateur déja existe."})
    }

    const hashedPass = await bcrypt.hash(password, 10);

    let avatar= 'avatar.png';
    if (req.file) {
        avatar= req.file.filename;
    }
    const NewUser = new user({
        email,
        password: hashedPass,
        nom, 
        prenom, 
        adresse, 
        tel,
        avatar,
        
    });
    

    try {
        await NewUser.save();
    } catch (error) {
        res.status(500).json({message: "something went wrong with DB", error: error})
    }

    
    res.status(201).json({message: "success", data: NewUser});
}

const login = async (req, res) => {

    const {email, password } = req.body;

    
    let existinguser;
    try {
        existinguser = await user.findOne({ email: email});
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existinguser) {
        return res.status(200).json({success: false, message: "User n'existe pas."})
    }

    let check = await bcrypt.compare( password, existinguser.password);

    if (!check) {
        return res.status(200).json({success: false, message: "Mot de passe est incorrect."})
    }

    return res.status(200).json({success: true, message: "Bienvenue", data: existinguser});

}

const GetAll = async (req, res) => {

    let existinguser;
    try {
        existinguser = await user.find();
    } catch (error) {
        return  res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }

    res.status(200).json({success: true, message: "success", data: existinguser});

}

const FindById = async(req, res) => {

    const { id } = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existinguser) {
        return res.status(405).json({success: false, message: "User Doesn't Exist!!"})
    }
    
    return res.status(200).json({success: true, message: "success", data: existinguser});

}

const Delete = async(req, res) => {

    const { id } = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existinguser) {
        return res.status(200).json({success: false, message: "User Doesn't Exist!!"})
    }
    if (existinguser.avatar !== 'avatar.png' && existinguser.avatar !== 'avaatar.png') {

        let path = `./uploads/images/${existinguser.avatar}`;
        try {
            fs.unlinkSync(path)
            //file removed
        } catch(error) {
            console.log(error);
            return res.status(200).json({success: false, message: error, error: error})
        }
    }
    
    try {
        await existinguser.remove();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(200).json({success: true, message: "deleted succesfully"});

}

const updateuser = async(req, res) => {

    const { nom, prenom, adresse, tel, password } = req.body;
    const { id } = req.params;

    let existinguser;
    try {
        existinguser = await user.findById(id);
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    if (!existinguser) {
        return res.status(405).json({success: false, message: "User Doesn't Exist!!"})
    }
    
    existinguser.nom = nom;
    existinguser.prenom = prenom;
    existinguser.tel = tel;
    existinguser.adresse = adresse;
    if (req.body.password) {
        existinguser.password = await bcrypt.hash(req.body.password, 10);
    }
    if (req.file) {
        existinguser.avatar = req.file.filename;
    }
        

    try {
        await existinguser.save();
    } catch (error) {
        return res.status(500).json({success: false, message: "something went wrong with DB", error: error})
    }
    
    return res.status(201).json({success: true, message: "Coordonnées modifiées avec succès", data: existinguser});

}

exports.Ajouter = Ajouter 
exports.GetAll = GetAll 
exports.FindById = FindById 
exports.Delete = Delete 
exports.updateuser = updateuser 
exports.login = login 
exports.Register = Register 