import { body, query } from 'express-validator'

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
        .exists()
]

export const ActivateAccountValidator = [
    query('code')
        .exists()
        .notEmpty()
        .isJWT()
]

export const LoginValidator = [
    body('username')
        .exists()
        .notEmpty(),
    body('password')
        .exists()
        .notEmpty()
]

export const ResendCodeValidator = [
    body('email')
        .exists()
        .notEmpty()
        .isEmail()
]