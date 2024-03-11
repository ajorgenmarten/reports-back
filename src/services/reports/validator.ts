import { body, param, query } from "express-validator";
import { validate } from "../../libs/check-express-validator-middlewares";
import { ReportModel } from "./models";
import lang from "../../lang";
import { modules, reportTypes } from "../../mocks/reports";

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
        .exists()
        .notEmpty()
        .isIn([...reportTypes]),
    body('seed')
        .if((value, {req}) => req.body.type == reportTypes[1])
        .exists()
        .trim()
        .notEmpty()
        .custom(async (value) => {
            const verifyLic = await ReportModel.findOne({seed: value})
            if (verifyLic)
                throw new Error(lang.services.reports.validators.seedHasSend)
            else
                return true
        }),
    body('department')
        .if( (value, {req}) => req.body.type == reportTypes[1] )
        .exists()
        .notEmpty(),
    body('module')
        .if((value, {req}) => req.body.type == reportTypes[1])
        .exists()
        .notEmpty()
        .isIn(modules),
    body('description')
        .optional()
        .exists(),
    body('status')
        .not()
        .exists(),
    body('solution')
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

export const validatePage = [
    query('page')
        .optional()
        .notEmpty()
        .isNumeric(),
    validate
]