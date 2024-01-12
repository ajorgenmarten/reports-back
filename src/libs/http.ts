import { Response } from "express";

type HttpResponse<T = any> = {
    success: boolean
    data?: T
    message?: string
    status?: number
}

/**
 * Esta funcion es para manejar respuestas satisfactorias
 * @param res Objeto Response de Express
 * @param {handleResponseConfig} config Objeto que contiene los datos que se van a enviar como respuesta
 * @returns 
 */
export const handleResponse = (res: Response, config: HttpResponse) => {
    const response: HttpResponse = {
        success: config.success,
        data: config.data,
        message: config.message,
        status: config.status
    }
    return res.status(config.status || 200).json(response)
}