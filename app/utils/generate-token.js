
import jwt from "jsonwebtoken";


const jwtGenerator=(payload,secretKey,expiresTime=1,expiresType="h")=>{
    if (!payload || !secretKey) {
        throw new Error("JWT data and secretKey must be provided.");
    }
    const expiresInValue = `${expiresTime}${expiresType}`;
    try {
        const token=jwt.sign(payload,secretKey,{expiresIn:expiresInValue});
    return token;
    } catch (error) {
        console.error("JWT signing failed due to internal issue:", error.message);
        throw new Error("Failed to generate token due to configuration error.");
    }
    
}

export default jwtGenerator;