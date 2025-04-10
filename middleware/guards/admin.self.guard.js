const ApiError = require("../../helpers/api.error")

module.exports = function(req, res, next){
    const {id} = req.params
    if(req.admin.role!=="admin" && id != req.admin.id){
        // return res
        //     .status(403)
        //     .send({message: "Faqat shaxsiy ma'lumotlarni ko'rishga ruxsat etidi"})
        throw ApiError.forbidden("Faqat shaxsiy ma'lumotlarni ko'rishga ruxsat etidi")
    }
    
    next()
    }
