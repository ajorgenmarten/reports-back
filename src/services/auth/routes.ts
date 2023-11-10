import { Router } from "express";

import { checkExpressValidatorMiddlewares } from "../../libs/check-express-validator-middlewares";

import { active, login, logout, refresh, register, resendCode } from "./controller";
import { ActivateAccountValidator, BaseUserValidator, LoginValidator, ResendCodeValidator } from "./validator";
import { existUserWithEmail, existUserWithUsername, checkRefreshTokenSigned, isAuth } from "./middlewares";

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
                            resendCode )

router.delete('/logout', checkRefreshTokenSigned,
                         isAuth,
                         logout )

router.get('/refresh', checkRefreshTokenSigned,
                       isAuth,
                       refresh)

export default router