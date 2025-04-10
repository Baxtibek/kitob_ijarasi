
module.exports = function(req, res, next){
    const {id} = req.params
    if(!req.client.id){
        return res
            .status(403)
            .send({message: "Faqat shaxsiy ma'lumotlarni ko'rishga ruxsat etidi"})
    }
    
    next()
    }
