const { errorHandler } = require("../helpers/error_handler");
// console.log("owner.controller.js")
// try {
    
//     const Owners = require("../models/owners.model");
// } catch (error) {
//     console.log(error)
// }
const ownerValidationSchema = require("../validations/owners.validation");
const bcrypt = require('bcrypt');
const config = require('config');
const jwtOwnerService = require("../services/jwt.owner.service");
const uuid = require('uuid');
const mailService = require("../services/mail.service");
const Owners = require("../models/owners.model");


const signUpOwner = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = ownerValidationSchema.validate(req.body)
        console.log(error)
        if(error){
            return res.status(400).send({message: message.error})
        }
        

        const {
            full_name, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            address,  
        } = value;

        if (password!=confirm_password){
            return res.status(400).send({message: "Parollar mos emas"})
        }

        const hashedPassword = bcrypt.hashSync(password, 7) // password hashlash 2ni 7darajasi
        const activation_link = uuid.v4() // email 
        
        const newOwner = await Owners.create({
            full_name, 
            phone_number, 
            email, 
            password: hashedPassword, 
            address,
            activation_link  
        });
        
        // Email xabar yuborish
        await mailService.sendActivationMail(newOwner.email, 
                `${config.get("api_url")}/api/owners/activate/${activation_link}`
            )

        res.status(201).send({message: "New owner added. Akkauntni faollashtirish uchun pochtaga o'ting", newOwner})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllOwners = async (req, res) => {
    try {
        const owners = await Owners.findAll();
        if(!owners){
            return res
                .status(400)
                .send({message: "Birorta owner topilmadi"})
        }
        res.status(201).send({owners})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findOwnerById = async (req, res) =>{
    try {
        const {id} = req.params
        const owner = await Owners.findByPk(id)
        if(!owner){
            return res
                .status(400)
                .send({message: "Owner topilmadi!"})
        }
        res.status(201).send({owner})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateOwnerById = async (req, res) => {
    try {
        const {error, value} = ownerValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).send({message: error.message});
        }

        const {id} = req.params;
        const {
            full_name, 
            phone_number, 
            email, 
            password, 
            confirm_password, 
            address 
        } = value;

        // Passwordlarni tekshirish
        if (password && password !== confirm_password) {
            return res.status(400).send({message: "Parollar mos kelmayapti"});
        }

        let updateData = {
            full_name, 
            phone_number,
            confirm_password, 
            email, 
            address
        };

        // Parolni hashlash agar yangilansa
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 7);
            updateData.password = hashedPassword;
        }

        const newOwner = await Owners.update(updateData, {
            where: { id },
            returning: true
        });

        if (newOwner[0] === 0) {
            return res.status(404).send({message: "Owner topilmadi"});
        }

        res.status(200).send({message: "Owner yangilandi", owner: newOwner[1][0]});

    } catch (error) {
        errorHandler(error, res);
    }
};

const updatePasswordOwner = async (req, res) => {
    try {
        const ownerId = req.owner.id
        console.log(ownerId);
        
        const {password, new_password, confirm_password} = req.body 

        const owner = await Owners.findByPk(ownerId)
        if(!owner) {
            return res.status(404).send({message: "Foydalanuvchi topilmadi"})
        }
        console.log(owner);
        
        const isMatch = await bcrypt.compare(password, owner.password)
        if(!isMatch){
            return res.status(400).send({message: "Eski password noto'g'ri"})
        }

        if(new_password !== confirm_password){
            return res.status(400).send({message: "Yangi parollar bir xil emas"})
        }

        const hashedPassword = await bcrypt.hashSync(new_password, 7)

        owner.password = hashedPassword
        await owner.save()

        res.status(200).send({ message: "Parol muvaffaqiyatli yangilandi" });
    } catch (error) {
        errorHandler(error, res)
    }
}


const deleteOwnerById = async (req, res) => {
    try {
        const {id} = req.params;
        const owner = await Owners.destroy({where: {id}})
        res.status(201).send({message: "Owner ochiyildi"}, owner)
    } catch (error) {
       errorHandler(error, res) 
    }
}

const loginOwner = async (req, res) => {
    try {
        const {email, password} = req.body
        
        //Identifation
        const owner = await Owners.findOne({where: {email } });
        if(!owner){
            return res
                .status(400)
                .send({message: "Email yoki password noto'g'ri!"})
        }

        //Autentifikatsiya
        const validPassword = bcrypt.compareSync(password, owner.password)
        if(!validPassword){
            return res
            .status(400)
            .send({message: "Email yoki password noto'g'ri!"})
        }

        const payload = {
            id: owner.id,
            full_name: owner.full_name,
            email: owner.email,

        }
        const tokens = jwtOwnerService.generateOwnerTokens(payload)

        owner.refresh_token = tokens.ownerRefreshToken // refresh_token databasaga saqlayapmiz va refresh_token cookiedan berib yubordik
        await owner.save()
        
        res.cookie("ownerRefreshToken", tokens.ownerRefreshToken, {
            httpOnly: true,
            maxAge: config.get("owner_refresh_cookie_time")
        })

        res.send({message: "Tizimga xush qelibsiz", ownerAccessToken: tokens.ownerAccessToken })
    } catch (error) {
        errorHandler(error, res)
    }
}

const logoutOwner = async (req, res) => {
    try {
        const { ownerRefreshToken } = req.cookies;
        console.log(ownerRefreshToken);
        
        if (!ownerRefreshToken) {
            return res
                .status(400)
                .send({ message: "Cookieda refresh token topilmadi!" });
        }

        let owner = await Owners.findOne({ where: { refresh_token: ownerRefreshToken } });

        if (!owner) {
            return res
                .status(400)
                .send({ message: "Bunday tokenli owner topilmadi!" });
        }

        await Owners.update(
            { refresh_token: null },
            { where: { id: owner.id } }
        );

        owner = await Owners.findOne({ where: { id: owner.id } });

        res.clearCookie("ownerRefreshToken");

        res.send({ message: "Owner logout successfully", owner });
    } catch (error) {
        errorHandler(error, res)
    }
}

const refreshTokenOwner = async (req, res) =>{
    try {
        const { ownerRefreshToken } = req.cookies;
        if (!ownerRefreshToken) {
            return res
                .status(400)
                .send({ message: "Cookieda refresh token topilmadi!" });
        }
        const decodedRefreshToken = await jwtOwnerService.verifyOwnerRefreshToken(ownerRefreshToken)
        const owner = await Owners.findOne({owner_refresh_token: ownerRefreshToken})
        if (!owner) {
            return res
                .status(400)
                .send({ message: "Bunday tokenli owner topilmadi!" });
        }
        const payload = {
            id: owner.id,
            username: owner.username,
            email: owner.email,

        }
        const tokens = jwtOwnerService.generateOwnerTokens(payload)

        owner.owner_refresh_token = tokens.ownerRefreshToken 
        await owner.save()
        res.cookie("ownerRefreshToken", tokens.ownerRefreshToken, {
            httpOnly: true,
            maxAge: config.get("owner_refresh_cookie_time")
        });

        res.send({ 
            message: "Tokens update", 
            ownerAccessToken: tokens.ownerAccessToken 
        });
    } catch (error) {
        errorHandler(error, res)
    }
}

const activateOwner = async(req, res) => {
    try {
      const owner = await Owners.findOne({activation_link: req.params.link})
      if(!owner){
        return res.status(404).send({message: "Bunday foydalanuchi topilmadi"})
      }
      owner.is_active = true;
      await owner.save()
      res.send({message: "Foydalanuvchi faollashtirildi", status: owner.is_active})
    } catch (error) {
      errorHandler(error, res)
    }
}


module.exports = {
    signUpOwner,
    findAllOwners,
    findOwnerById,
    updateOwnerById,
    updatePasswordOwner,
    deleteOwnerById,
    loginOwner,
    logoutOwner,
    refreshTokenOwner,
    activateOwner
}