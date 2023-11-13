import { Response } from "express";

type HttpResponse<T = any> = {
    success: boolean
    data?: T
    message?: string
    status?: number
}
type handleErrorConfig = {
    /**
     * @type {any} Tiene que ser el Objeto Error (throw new Error)
     */
    error: any
    status?: number
}
type handleResponseConfig = {
    success: HttpResponse['success']
    message?: HttpResponse['message']
    data?: HttpResponse['data']
} & Omit<handleErrorConfig, "error">

/**
 * Esta funcion es para manejar manejar respuestas de errores, generalmente se debe usar en un try catch
 * @param res Objeto Response de Express
 * @param {handleErrorConfig} config Objeto que contiene los datos que se van a enviar como respuesta
 * @returns 
 */
export const handleError = (res: Response, config: handleErrorConfig) => {
    const response: HttpResponse = {
        success: false,
        message: config.error.message,
        status: config.status
    }
    return res.status(config.status || 500).json(response)
}

/**
 * Esta funcion es para manejar respuestas satisfactorias
 * @param res Objeto Response de Express
 * @param {handleResponseConfig} config Objeto que contiene los datos que se van a enviar como respuesta
 * @returns 
 */
export const handleResponse = (res: Response, config: handleResponseConfig) => {
    const response: HttpResponse = {
        success: config.success,
        data: config.data,
        message: config.message,
        status: config.status
    }
    return res.status(config.status || 200).json(response)
}