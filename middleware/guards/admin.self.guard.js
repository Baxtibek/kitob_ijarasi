const ApiError = require("../../helpers/api.error")

module.exports = function(req, res, next){
    if(req.admin.role!=="admin" && id != req.admin.id){
        throw ApiError.forbidden("Faqat shaxsiy ma'lumotlarni ko'rishga ruxsat etidi")
    }
    
    next()
    }
