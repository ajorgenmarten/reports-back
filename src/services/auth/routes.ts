import { Router } from "express";

import { active, forgot, login, logout, refresh, register, resendCode } from "./controller";
import { ActivateAccountValidator, BaseUserValidator, LoginValidator, ResendCodeValidator, forgotValidator } from "./validator";
import { existUserWithEmail, existUserWithUsername, isAuth } from "./middlewares";

const router = Router()

router.post('/register', BaseUserValidator,
                         existUserWithEmail,
                         existUserWithUsername,
                         register )

router.get('/active', ActivateAccountValidator,
                      active )

router.post('/login', LoginValidator,
                      login )

router.post('/resend-code', ResendCodeValidator,
                            resendCode )

router.delete('/logout', isAuth,
                         logout )

router.get('/refresh', isAuth,
                       refresh)

router.post('/forgot', forgotValidator,
                        forgot)

export { router }