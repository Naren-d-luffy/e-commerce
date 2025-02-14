import { Router } from "express";
import userRouter from "./User/userRouter.js"; 

const router = Router();

const defaultRoutes = [
    {
        path: "/users",
        route: userRouter
    },
];

defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;
