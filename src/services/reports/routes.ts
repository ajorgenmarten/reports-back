import { Router } from "express";

import { create } from "./controller";
import { reportCreateValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";

import { checkExpressValidatorMiddlewares } from "../../libs/check-express-validator-middlewares";

const router = Router()

router.post('/create', checkExpressValidatorMiddlewares(reportCreateValidator) ,
                       isAuth,
                       can(),
                       create)

export default router