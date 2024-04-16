import { Router } from "express";
import { subscription } from "./controller";
import { can, requireAuth } from "../auth/middlewares";
const router = Router()

router.use( requireAuth, can() )

router.post('/subscribe', subscription)

export { router }
