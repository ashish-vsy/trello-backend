import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    limit: 5,
    message: { status: 0, msg: 'Too many password tries from this IP, please try again after 10 minutes' },
    headers: true, 
});

const VerifyToken = (req, res, next) => {
    try {
        let authorization = req.headers.authorization;
        if (!authorization) throw 'error';

        const token = authorization.replace(/^Bearer\s+/, "");
		
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (decode.type === 'member' && decode.userid) {
            next(); 
        } else {
            return res.status(401).json({ status: 0, message: "User unauthorized." });
        }
    } catch (error) {
        console.log("tokenverification-error", error);
        return res.status(401).json({ status: 0, message: "User unauthorized." });
    }
};

export { limiter, VerifyToken };
