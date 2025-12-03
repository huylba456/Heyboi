import { getAccount, loginWithJWT, postRegister } from 'controllers/auth-controller'
import express, { Express } from 'express'
import passport from 'passport'
import { verifyToken } from 'src/middleware/verifyToken'

// import fileUploadMiddleware from 'src/middleware/multer'
const router = express.Router()

const authRouter = (app: Express) => {

    router.post('/login', (req, res, next) => {
        passport.authenticate("local", { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: info?.message || "Email / Password không đúng"
                });
            }
            req.user = user;
            return loginWithJWT(req, res);
        })(req, res, next);
    });

    router.post('/register', postRegister)
    router.get('/account', verifyToken, getAccount)

    app.use("/auth", router)
}

export default authRouter