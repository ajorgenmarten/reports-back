import { body, header, query } from 'express-validator'
import { validate } from '../../libs/check-express-validator-middlewares'
import lang from '../../lang'


export const BaseUserValidator = [
    body('_id')
        .not()
        .exists()
        .withMessage(lang.services.auth.validators.breakRules),
    body('name')
        .exists()
        .withMessage(lang.services.auth.validators.exist + "name.")
        .notEmpty()
        .withMessage("name" + lang.services.auth.validators.notEmpty)
        .isLength({min: 3}),
    body('username')
        .exists()
        .withMessage(lang.services.auth.validators.exist + "username.")
        .notEmpty()
        .withMessage("username" + lang.services.auth.validators.notEmpty)
        .isLength({min: 3}),
    body('email')
        .exists()
        .withMessage(lang.services.auth.validators.exist + "email.")
        .notEmpty()
        .withMessage("email" + lang.services.auth.validators.notEmpty)
        .isEmail(),
    body('password')
        .exists()
        .withMessage(lang.services.auth.validators.exist + "password.")
        .notEmpty()
        .withMessage("password" + lang.services.auth.validators.notEmpty)
        .isLength({min: 8}),
    body('code')
        .not()
        .exists()
        .withMessage(lang.services.auth.validators.breakRules),
    body('status')
        .not()
        .exists()
        .withMessage(lang.services.auth.validators.breakRules),
    validate
]

export const ActivateAccountValidator = [
    query('code')
        .exists()
        .notEmpty()
        .isJWT(),
    validate
]

export const LoginValidator = [
    body('username')
        .exists()
        .notEmpty(),
    body('password')
        .exists()
        .notEmpty(),
    validate
]

export const ResendCodeValidator = [
    body('email')
        .exists()
        .notEmpty()
        .isEmail(),
    validate
]

export const accessTokenValidator = [
    header('Authorization')
        .exists()
        .notEmpty()
        .trim('Bearer ')
        .isJWT(),
    validate
]
