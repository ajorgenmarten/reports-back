import { body, param, query } from "express-validator";
import { validate } from "../../libs/check-express-validator-middlewares";

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
        .exists(),
    validate
]

export const getReportValidator = [
    param('id')
        .exists()
        .notEmpty()
        .isMongoId(),
    validate
]

export const getMyReportsValidator = [
    query('page')
        .optional()
        .exists()
        .notEmpty()
        .isNumeric(),
    validate
]