import { Request, Response } from "express";
import { createUser, generateToken, getUserByid } from "services/auth.service";
import { RegisterSchema, TRegisterSchema } from "src/validation/register.schema";

const loginWithJWT = (req: Request, res: Response) => {
    const user = req.user as any; // Passport gắn vào
    if (!user) {
        return res.status(401).json({ message: "Email / Password không đúng" });
    }

    const token = generateToken(user);
    return res.json({
        message: "Login successful",
        token,
    });
}

const postRegister = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword } = req.body as TRegisterSchema
    const validate = await RegisterSchema.safeParseAsync(req.body)
    if (!validate.success) {
        const errorZod = validate.error.issues;
        const errors = errorZod?.map(item => ({
            field: item.path[0],
            message: item.message
        }))
        return res.status(400).json({
            success: false,
            errors,
            oldData: { name, email, password, confirmPassword }
        })
    }

    try {
        const newUser = await createUser(name, email, password);
        res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            user: newUser
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi đăng ký",
            error
        });
    }

}

// giúp fe refresh vẫn lấy lại đuọc thông tin user đăng nhập
const getAccount = async (req: Request, res: Response) => {
    const user_id = req.user.id

    try {
        const user = await getUserByid(+user_id)
        return res.status(201).json({
            success: true,
            message: "Lấy thông tin account thành công",
            data: {
                user
            }
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi khi lấy thông tin account",
            error
        });
    }
}


export { loginWithJWT, postRegister, getAccount }