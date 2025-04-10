const nodemailer = require('nodemailer');
const config = require('config');

class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: config.get("smtp_host"),
            port: config.get("smtp_port"),
            secure: false,
            auth: {
                user: config.get("smtp_user"),
                pass: config.get("smtp_password")
            }
        })
    }

    async sendActivationMail(toEmail, link){
        await this.transporter.sendMail({
            from: config.get("smtp_user"),
            to: toEmail,
            subject: "Kitob ijarasi akkauntini faollashtirissh",
            text: "",
            html: `
            <div>
                <h3>Akkaunti faollashtirish uchun quydagi linkni bosing:</h3>
                <a href=${link}>Faollashtirish</a>
            </div>
            `
        })
    }
}

module.exports = new MailService()