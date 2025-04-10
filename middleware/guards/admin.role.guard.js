const ApiError = require("../../helpers/api.error")

module.exports = (allowedRoles) => {
    return (req, res, next) => {
        const admin = req.admin
        // console.log(admin)
        if(!admin){
            throw ApiError.unauthorized("Token berilmagan")
        }

        if(!allowedRoles.includes(admin.role)) {
            throw ApiError.unauthorized("Access Denied")  
        }
        next()
    }

}