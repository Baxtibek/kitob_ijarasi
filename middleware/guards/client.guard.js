const { errorHandler } = require("../../helpers/error_handler");
const jwtClientService = require("../../services/jwt.client.service");

module.exports = async function(req, res, next){
    try {
        //Guard yoki Police
        const authorization = req.headers.authorization
        console.log(authorization);
        if(!authorization){
            return res
                .status(403)
                .send({message: "authorization token berilmagan"})
        }

        const bearer = authorization.split(" ")[0]
        const token = authorization.split(" ")[1]

        if(bearer != "Bearer" || !token){
            return res
                .status(403)
                .send({message: "Bearer yoki token berilmagan"})
        }
        
        // Guardlarni ichida faqat accessTokendan foydalanamiz. accessTokendan ruxsat olish uchun kerak.
        const decodedToken = await jwtClientService.verifyClientAccessToken(token)
        
        req.client = decodedToken
        console.log(req.client);
        
        
        next()
    } catch (error) {
        errorHandler(error, res)
    }
    }
