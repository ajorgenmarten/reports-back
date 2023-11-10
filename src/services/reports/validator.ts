import { body } from "express-validator";

export const reportCreateValidator = [
    body('_id')
        .not()
        .exists(),
    body('author')
        .exists()
        .notEmpty()
        .isMongoId(),
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