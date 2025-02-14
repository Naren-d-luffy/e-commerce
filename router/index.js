import { Router } from "express";
import userRouter from "./User/userRouter.js"; 
import adminRouter from "./Admin/adminRouter.js"
import otpRouter from "./OTP/otpRouter.js"; 

const router = Router();

const defaultRoutes = [
    {
        path: "/admin",
        route: adminRouter
    },
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/otp",
        route: otpRouter
    },
];

defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
