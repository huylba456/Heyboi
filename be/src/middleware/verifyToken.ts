import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config'
import { promisify } from "util";
import { getUserSumCart } from "services/auth.service";

const verifyAsync = promisify<string, string, any>(jwt.verify);

//mã hóa token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Xin vui lòng đăng nhập để tiếp tục' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'Định dạng token không hợp lệ, vui lòng đăng nhập lại' });
    }

    try {
        const decoded = await verifyAsync(token, process.env.JWT_SECRET as string);
        const user = decoded as Express.User;

        user.sumCart = await getUserSumCart(user.id);
        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn, vui lòng đăng nhập lại' });
    }
};