import { Router } from "express";
import { subscription } from "./controller";
import { can, isAuth } from "../auth/middlewares";
const router = Router()

router.use( isAuth, can() )

router.post('/subscribe', subscription)

export { router }
