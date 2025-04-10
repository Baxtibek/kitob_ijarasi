const { errorHandler } = require("../helpers/error_handler");
const Admins = require("../models/admin.model");
const adminValidationSchema = require("../validations/admins.validation");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtService = require("../services/jwt.service");

const signUpAdmin = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = adminValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }
        
        const { 
            username, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            is_active,   
            role 
        } = value;

        if (password!=confirm_password){
            return res.status(400).send({message: "Parollar mos emas"})
        }

        const hashedPassword =  bcrypt.hashSync(password, 7) // password hashlash 2ni 7darajasi

        const newAdmin = await Admins.create({
            username, 
            phone_number, 
            email, 
            password: hashedPassword, 
            is_active,  
            role 
        });


        res.status(201).send({message: "New admin added", newAdmin})
    } catch (error) { 
        errorHandler(error, res)
    }
}

const findAllAdmins = async (req, res) => {
    try {
        const admins = await Admins.findAll();
        if(!admins){
            return res
                .status(400)
                .send({message: "Birorta admin topilmadi"})
        }
        res.status(201).send({message: "Success", admins})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findAdminById = async (req, res) =>{
    try {
        const {id} = req.params
        const admin = await Admins.findByPk(id)
        if(!admin){
            return res
                .status(400)
                .send({message: "Admin topilmadi!"})
        }
        res.status(201).send({message: "Success", admin})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateAdminById = async (req, res) => {
    try {
        const {error, value} = adminValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).send({message: error.message});
        }

        const {id} = req.params;
        const {
            username, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            is_active,  
            role 
        } = value;

        // Passwordlarni tekshirish
        if (password && password !== confirm_password) {
            return res.status(400).send({message: "Parollar mos kelmayapti"});
        }

        let updateData = {
            username, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            is_active,  
            role
        };

        // Parolni hashlash agar yangilansa
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 7);
            updateData.password = hashedPassword;
        }

        const newAdmin = await Admins.update(updateData, {
            where: { id },
            returning: true
        });

        if (newAdmin[0] === 0) {
            return res.status(404).send({message: "Admin topilmadi"});
        }

        res.status(200).send({message: "Admin yangilandi", admin: newAdmin[1][0]});

    } catch (error) {
        errorHandler(error, res);
    }
};


const updatePasswordAdmin = async (req, res) => {
    try {
        const adminId = req.admin.id
        console.log(adminId);
        
        const {password, new_password, confirm_password} = req.body 

        const admin = await Admins.findByPk(adminId)
        if(!admin) {
            return res.status(404).send({message: "Foydalanuvchi topilmadi"})
        }
        console.log(admin);
        
        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch){
            return res.status(400).send({message: "Eski password noto'g'ri"})
        }

        if(new_password !== confirm_password){
            return res.status(400).send({message: "Yangi parollar bir xil emas"})
        }

        const hashedPassword = await bcrypt.hashSync(new_password, 7)

        admin.password = hashedPassword
        await admin.save()

        res.status(200).send({ message: "Parol muvaffaqiyatli yangilandi" });
    } catch (error) {
        errorHandler(error, res)
    }
}


const deleteAdminById = async (req, res) => {
    try {
        const {id} = req.params;
        const admin = await Admins.destroy({where: {id}})
        res.status(201).send({message: "Admin ochiyildi"}, admin)
    } catch (error) {
       errorHandler(error, res) 
    }
}

const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body
        //Identifation
        const admin = await Admins.findOne({where: {email } });
        if(!admin){
            return res
                .status(400)
                .send({message: "Email yoki password noto'g'ri!"})
        }

        //Autentifikatsiya
        const validPassword = bcrypt.compareSync(password, admin.password)
        if(!validPassword){
            return res
            .status(400)
            .send({message: "Email yoki password noto'g'ri!"})
        }

        const payload = {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: admin.role

        }
        const tokens = jwtService.generateTokens(payload)

        admin.refresh_token = tokens.refreshToken // refresh_token databasaga saqlayapmiz va refresh_token cookiedan berib yubordik
        await admin.save()
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: config.get("refresh_cookie_time")
        })


        res.send({message: "Tizimga xush qelibsiz", accessToken: tokens.accessToken })
    } catch (error) {
        errorHandler(error, res)
    }
}

const logoutAdmin = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res
                .status(400)
                .send({ message: "Cookieda refresh token topilmadi!" });
        }

        let admin = await Admins.findOne({ where: { refresh_token: refreshToken } });

        if (!admin) {
            return res
                .status(400)
                .send({ message: "Bunday tokenli admin topilmadi!" });
        }

        await Admins.update(
            { refresh_token: null },
            { where: { id: admin.id } }
        );

        admin = await Admins.findOne({ where: { id: admin.id } });

        res.clearCookie("refreshToken");

        res.send({ message: "Admin logout successfully", admin });
    } catch (error) {
        errorHandler(error, res)
    }
}

const refreshTokenAdmin = async (req, res) =>{
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res
                .status(400)
                .send({ message: "Cookieda refresh token topilmadi!" });
        }
        const decodedRefreshToken = await jwtService.verifyRefreshToken(refreshToken)
        const admin = await Admins.findOne({refresh_token: refreshToken})
        if (!admin) {
            return res
                .status(400)
                .send({ message: "Bunday tokenli admin topilmadi!" });
        }
        const payload = {
            id: admin.id,
            username: admin.username,
            email: admin.email,

        }
        const tokens = jwtService.generateTokens(payload)

        admin.refresh_token = tokens.refreshToken 
        await admin.save()
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            maxAge: config.get("refresh_cookie_time")
        });

        res.send({ 
            message: "Tokens update", 
            accessToken: tokens.accessToken 
        });
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    signUpAdmin,
    findAllAdmins,
    findAdminById,
    updateAdminById,
    updatePasswordAdmin,
    deleteAdminById,
    loginAdmin,
    logoutAdmin,
    refreshTokenAdmin
}