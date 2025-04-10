const { errorHandler } = require("../../helpers/error_handler");
const jwtService = require("../../services/jwt.service");

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
        
        // Guardlarni ichida faqat accessTokendan foydalanamiz. accessTokendan ruxsat olsih uchun kerak.
        const decodedToken = await jwtService.verifyAccessToken(token)
        
        req.admin = decodedToken
        console.log(decodedToken);
        
        console.log(req.admin);
        
        
        next()
    } catch (error) {
        errorHandler(error, res)
    }
    }
