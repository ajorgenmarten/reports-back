import { Router } from "express";

import { active, changePassword, forgot, login, logout, me, refresh, register, resendCode } from "./controller";
import { ActivateAccountValidator, BaseUserValidator, LoginValidator, ResendCodeValidator, ChangePasswordValidator, ForgotValidator } from "./validator";
import { can, existUserWithEmail, existUserWithUsername, isAuth } from "./middlewares";

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
                         can(),
                         logout )

router.get('/refresh', isAuth,
                       refresh)

router.post('/forgot', ForgotValidator,
                        forgot)

router.post('/change-password', ChangePasswordValidator,
                                changePassword)

router.get('/me', isAuth, can(), me)

export { router }