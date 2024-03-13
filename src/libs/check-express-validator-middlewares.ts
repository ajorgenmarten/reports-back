import { RequestHandler } from "express"
import { validationResult } from "express-validator"
import { handleResponse } from "./http"

export const validate: RequestHandler = (req, res, next) => {
    const validation = validationResult(req)
    if ( validation.isEmpty() ) return next()
    return handleResponse(res, {
        success: false,
        message: validation.array({onlyFirstError: true})[0].msg,
        status: 400,
    })
}