import { body, param, query } from "express-validator";

export const reportCreateValidator = [
    body('_id')
        .not()
        .exists(),
    body('author')
        .not()
        .exists(),
    body('title')
        .exists()
        .notEmpty(),
    body('type')
        .exists(),
    body('seed')
        .optional()
        .exists()
        .notEmpty(),
    body('description')
        .optional()
        .exists()
        .notEmpty(),
    body('status')
        .not()
        .exists()    
]

export const getReportValidator = [
    param('id')
        .exists()
        .notEmpty()
        .isMongoId()
]

export const getMyReportsValidator = [
    query('page')
        .optional()
        .exists()
        .notEmpty()
        .isNumeric()
]