import { Router } from "express";

import { create } from "./controller";
import { verifySeed } from "./middlewares";
import { reportCreateValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";

import { checkExpressValidatorMiddlewares } from "../../libs/check-express-validator-middlewares";

const router = Router()

router.post('/create', isAuth,
                       checkExpressValidatorMiddlewares(reportCreateValidator),
                       can(),
                       verifySeed,
                       create)

export default router