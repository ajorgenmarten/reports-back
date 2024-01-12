import { body, header, query } from 'express-validator'
import { validate } from '../../libs/check-express-validator-middlewares'


export const BaseUserValidator = [
    body('_id')
        .not()
        .exists(),
    body('name')
        .exists()
        .notEmpty()
        .isLength({min: 3}),
    body('username')
        .exists()
        .notEmpty()
        .isLength({min: 3}),
    body('email')
        .exists()
        .notEmpty()
        .isEmail(),
    body('password')
        .exists()
        .notEmpty()
        .isLength({min: 8}),
    body('code')
        .not()
        .exists(),
    body('status')
        .not()
        .exists(),
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
