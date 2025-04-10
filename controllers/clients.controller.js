const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../models/clients.model");
const clientValidationSchema = require("../validations/clients.validation");
const bcrypt = require('bcrypt');
const jwtClientService = require("../services/jwt.client.service")
const config = require('config');
const uuid = require('uuid');
const mailService = require("../services/mail.service");

const signUpClient = async(req, res) => {
    try {
        // Validatsiya qilish
        const {error, value} = clientValidationSchema.validate(req.body)
        if(error){
            return res.status(400).send({message: error.message})
        }

        const { 
            full_name, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            registered_at
        } = value;

        if (password != confirm_password){
            return res.status(400).send({message: "Parollar mos emas"})
        }

        const hashedPassword = bcrypt.hashSync(password, 7)
        const activation_link = uuid.v4() // email 

        const newClient = await Clients.create({
            full_name, 
            phone_number, 
            email, 
            password: hashedPassword, 
            registered_at, 
            activation_link
        });
        
        // Email xabar yuborish
        await mailService.sendActivationMail(newClient.email, 
            `${config.get("api_url")}/api/clients/activate/${activation_link}`
        )

        res.status(201).send({message: "New client added. Akkauntni faollashtirish uchun pochtaga o'ting", newClient})
    } catch (error) { 
        errorHandler(error, res)
    }
}


const findAllClients = async (req, res) => {
    try {
        const clients = await Clients.findAll();
        if(!clients){
            return res
                .status(400)
                .send({message: "Birorta client topilmadi"})
        }
        res.status(201).send({clients})
    } catch (error) {
        errorHandler(error, res)
    }
}

const findClientById = async (req, res) =>{
    try {
        const {id} = req.params
        const client = await Clients.findByPk(id)
        if(!client){
            return res
                .status(400)
                .send({message: "Client topilmadi!"})
        }
        res.status(201).send({client})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateClientById = async (req, res) => {
    try {
        const {error, value} = clientValidationSchema.validate(req.body)

        if(error){
            return res.status(400).send({message: error.message})
        }
        const {id} = req.params

        let {
            full_name, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            registered_at, 
        } = value;

        // Passwordlarni tekshirish
        if (password && password !== confirm_password) {
            return res.status(400).send({message: "Parollar mos kelmayapti"});
        }

        // Parolni hashlash agar yangilansa
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 7);
            password = hashedPassword;
        }

        const newClient = await Clients.update({
            full_name, 
            phone_number, 
            email, 
            password,
            confirm_password, 
            registered_at,  
        }, 
            {where: {id}, returning: true}
        );

        if (newClient[0] === 0) {
            return res.status(404).send({message: "Admin topilmadi"});
        }

    res.status(200).send({newClient: newClient[1][0]})

    } catch (error) {
        errorHandler(error, res)
    }
}

const updatePasswordClient = async (req, res) => {
    try {
        const clientsId = req.client.id
        console.log(clientsId);
        
        const {password, new_password, confirm_password} = req.body 

        const client = await Clients.findByPk(clientsId)
        if(!client) {
            return res.status(404).send({message: "Foydalanuvchi topilmadi"})
        }
        console.log(client);
        
        const isMatch = await bcrypt.compare(password, client.password)
        if(!isMatch){
            return res.status(400).send({message: "Eski password noto'g'ri"})
        }

        if(new_password !== confirm_password){
            return res.status(400).send({message: "Yangi parollar bir xil emas"})
        }

        const hashedPassword = await bcrypt.hashSync(new_password, 7)

        client.password = hashedPassword
        await client.save()

        res.status(200).send({ message: "Parol muvaffaqiyatli yangilandi" });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteClientById = async (req, res) => {
    try {
        const {id} = req.params;
        const client = await Clients.destroy({where: {id}})
        res.status(201).send({message: "Client ochiyildi"}, client)
    } catch (error) {
       errorHandler(error, res) 
    }
}

const loginClient = async (req, res) => {
    try {
        const {email, password} = req.body
        
        //Identifation
        const client = await Clients.findOne({where: {email } });
        if(!client){
            return res
                .status(400)
                .send({message: "Email yoki password noto'g'ri!"})
        }

        //Autentifikatsiya
        const validPassword = bcrypt.compareSync(password, client.password)
        if(!validPassword){
            return res
            .status(400)
            .send({message: "Email yoki password noto'g'ri!"})
        }

        const payload = {
            id: client.id,
            full_name: client.full_name,
            email: client.email,

        }
        const tokens = jwtClientService.generateClientTokens(payload)

        client.refresh_token = tokens.clientRefreshToken // refresh_token databasaga saqlayapmiz va refresh_token cookiedan berib yubordik
        await client.save()
        
        res.cookie("clientRefreshToken", tokens.clientRefreshToken, {
            httpOnly: true,
            maxAge: config.get("client_refresh_cookie_time")
        })

        res.send({message: "Tizimga xush qelibsiz", clientAccessToken: tokens.clientAccessToken })
    } catch (error) {
        errorHandler(error, res)
    }
}

const logoutClient = async (req, res) => {
    try {
        const { clientRefreshToken } = req.cookies;
        console.log(clientRefreshToken);
        
        if (!clientRefreshToken) {
            return res
                .status(400)
                .send({ message: "Cookieda refresh token topilmadi!" });
        }

        let client = await Clients.findOne({ where: { refresh_token: clientRefreshToken } });

        if (!client) {
            return res
                .status(400)
                .send({ message: "Bunday tokenli client topilmadi!" });
        }

        await Clients.update(
            { refresh_token: null },
            { where: { id: client.id } }
        );

        client = await Clients.findOne({ where: { id: client.id } });

        res.clearCookie("clientRefreshToken");

        res.send({ message: "Client logout successfully", client });
    } catch (error) {
        errorHandler(error, res)
    }
}

const refreshTokenClient = async (req, res) =>{
    try {
        const { clientRefreshToken } = req.cookies;
        if (!clientRefreshToken) {
            return res
                .status(400)
                .send({ message: "Cookieda refresh token topilmadi!" });
        }
        const decodedRefreshToken = await jwtClientService.verifyClientRefreshToken(clientRefreshToken)
        const client = await Clients.findOne({client_refresh_token: clientRefreshToken})
        if (!client) {
            return res
                .status(400)
                .send({ message: "Bunday tokenli client topilmadi!" });
        }
        const payload = {
            id: client.id,
            username: client.username,
            email: client.email,

        }
        const tokens = jwtClientService.generateClientTokens(payload)

        client.client_refresh_token = tokens.clientRefreshToken 
        await client.save()
        res.cookie("clientRefreshToken", tokens.clientRefreshToken, {
            httpOnly: true,
            maxAge: config.get("client_refresh_cookie_time")
        });

        res.send({ 
            message: "Tokens update", 
            clientAccessToken: tokens.clientAccessToken 
        });
    } catch (error) {
        errorHandler(error, res)
    }
}

const activateClient = async(req, res) => {
    try {
      const client = await Clients.findOne({activation_link: req.params.link})
      if(!client){
        return res.status(404).send({message: "Bunday foydalanuchi topilmadi"})
      }
      client.is_active = true;
      await client.save()
      res.send({message: "Foydalanuvchi faollashtirildi", status: client.is_active})
    } catch (error) {
      errorHandler(error, res)
    }
}

module.exports = {
    signUpClient,
    findAllClients,
    findClientById,
    updateClientById,
    updatePasswordClient,
    deleteClientById,
    loginClient,
    logoutClient,
    refreshTokenClient,
    activateClient
}