import jwt from 'jsonwebtoken';

export function loginMiddleware(req, res, next) {
const authHeader = req.headers.authorization;


if (!authHeader) {
    return res.status(401).json({message:"no token"});
}
    const token = authHeader.split(" ")[1];
try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}catch(err){
    return res.status(401).json({message:"no token"});
}
}