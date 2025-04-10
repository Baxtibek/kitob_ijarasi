const config = require('config');
const jwt = require('jsonwebtoken');

class JwtClientService {
    constructor(clientAccessKey, clientRefreshKey, clientAccessTime, clientRefreshTime){
        this.clientAccessKey = clientAccessKey;
        this.clientRefreshKey = clientRefreshKey;
        this.clientAccessTime = clientAccessTime;
        this.clientRefreshTime = clientRefreshTime
    }
    generateClientTokens(payload){
        const clientAccessToken = jwt.sign(payload, this.clientAccessKey, {
            expiresIn: this.clientAccessTime,
        })

        const clientRefreshToken = jwt.sign(payload, this.clientRefreshKey, {
            expiresIn: this.clientRefreshTime,
        })
        return {
            clientAccessToken,
            clientRefreshToken
        }
    }
    async verifyClientAccessToken(token){
        return jwt.verify(token, this.clientAccessKey)
    }

    async verifyClientRefreshToken(token){
        return jwt.verify(token, this.clientRefreshKey)
    }
}

module.exports = new JwtClientService(
    config.get("owner_access_key"),
    config.get("owner_refresh_key"),
    config.get("owner_access_time"),
    config.get("owner_refresh_time")
)