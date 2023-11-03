import { RequestHandler } from 'express'
import { validationResult, ValidationChain } from 'express-validator'

const checkExpressValidatorMiddlewaresFunction: RequestHandler =  (req, res, next) => {
    const validationResults = validationResult(req)
    if(validationResults.isEmpty()) return next()
    else res.status(400).json({ success: false,
                                data: validationResults.array({onlyFirstError: true}),
                                message: "Error de validadion de datos.",
                                status: 400})
}

export const checkExpressValidatorMiddlewares = (expressValidatorSchemas: ValidationChain[]): RequestHandler[] => {
    return [...expressValidatorSchemas, checkExpressValidatorMiddlewaresFunction]
}