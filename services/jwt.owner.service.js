const config = require('config');
const jwt = require('jsonwebtoken');

class JwtOwnerService {
    constructor(ownerAccessKey, ownerRefreshKey, ownerAccessTime, ownerRefreshTime){
        this.ownerAccessKey = ownerAccessKey;
        this.ownerRefreshKey = ownerRefreshKey;
        this.ownerAccessTime = ownerAccessTime;
        this.ownerRefreshTime = ownerRefreshTime
    }
    generateOwnerTokens(payload){
        const ownerAccessToken = jwt.sign(payload, this.ownerAccessKey, {
            expiresIn: this.ownerAccessTime,
        })

        const ownerRefreshToken = jwt.sign(payload, this.ownerRefreshKey, {
            expiresIn: this.ownerRefreshTime,
        })
        return {
            ownerAccessToken,
            ownerRefreshToken
        }
    }
    async verifyOwnerAccessToken(token){
        return jwt.verify(token, this.ownerAccessKey)
    }

    async verifyOwnerRefreshToken(token){
        return jwt.verify(token, this.ownerRefreshKey)
    }
}

module.exports = new JwtOwnerService(
    config.get("owner_access_key"),
    config.get("owner_refresh_key"),
    config.get("owner_access_time"),
    config.get("owner_refresh_time")
)