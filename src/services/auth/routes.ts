import { Router } from "express";

import { checkExpressValidatorMiddlewares } from "../../libs/check-express-validator-middlewares";

import { active, login, register, resendCode } from "./controller";
import { ActivateAccountValidator, BaseUserValidator, LoginValidator, ResendCodeValidator } from "./validator";
import { existUserWithEmail, existUserWithUsername } from "./middlewares";

const router = Router()

router.post('/register', checkExpressValidatorMiddlewares(BaseUserValidator),
                         existUserWithEmail,
                         existUserWithUsername,
                         register )

router.get('/active', checkExpressValidatorMiddlewares(ActivateAccountValidator),
                      active )

router.post('/login', checkExpressValidatorMiddlewares(LoginValidator),
                      login )

router.post('/resend-code', checkExpressValidatorMiddlewares(ResendCodeValidator),
                            resendCode)

export default router