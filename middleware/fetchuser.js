const jwt = require("jsonwebtoken");

const JWT_SECRET = "vishal$123";

const fetchuser = (req, res, next) => {
    // Get the user from the JWT token and add id to req object
    const token = req.header("auth-token");
    if(!token){
        return res.status(401).json({error: "Please authenticate using the valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next(); 
    } catch (error) {
        return res.status(401).json({error: "Please authenticate using the valid token"})
    }
}

module.exports = fetchuser;