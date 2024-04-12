import { Router } from "express";

import { active, changePassword, forgot, login, logout, me, refresh, register, resendCode } from "./controller";
import { ActivateAccountValidator, BaseUserValidator, LoginValidator, ResendCodeValidator, ChangePasswordValidator, ForgotValidator } from "./validator";
import { can, existUserWithEmail, existUserWithUsername, requireAuth } from "./middlewares";

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

router.delete('/logout', requireAuth,
                         can(),
                         logout )

router.get('/refresh', requireAuth,
                       refresh)

router.post('/forgot', ForgotValidator,
                        forgot)

router.post('/change-password', ChangePasswordValidator,
                                changePassword)

router.get('/me', requireAuth, can(), me)

export { router }