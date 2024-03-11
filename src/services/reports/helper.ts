import { ObjectId } from "mongoose"
import { ReportModel } from "./models"
import lang from "../../lang";

export const getMyReports = async ( userId: ObjectId, page: number = 0 ) => { 
    const [skip, limit] = pageLimits(page)

    const totalRegisters = await ReportModel.find({ author: userId }).count()
    const reports = await ReportModel.find({author: userId}).skip(skip).limit(limit).sort( { createdAt: "descending" } ).populate('author')
    const [prev, current, next, totalPages] = getPageInfo(totalRegisters, limit, page)

    return { reports, pagination: { prev, next, current, total: totalPages, totalRegisters } }
}

export const getAllReports = async (page: number) => {
    const [skip, limit] = pageLimits(page)
    const totalRegisters = await ReportModel.find().count()
    const reports = await ReportModel.find().skip(skip).limit(limit).sort( { createdAt: "descending" } ).populate('author')
    const [prev, current, next, totalPages] = getPageInfo(totalRegisters, limit, page)

    return { reports, pagination: { prev, next, current, total: totalPages, totalRegisters } }
} 

/**
 * 
 * @param page pagina que se desea recuperar
 * @returns @type {[skip: Number, limit: Number]} parametros de busqueda
 */
const pageLimits = (page: number) => {
    if (page < 0) throw new Error(lang.services.reports.helper.getMyReportPageError);

    const itemsPerPage = 50
    const skip = page * itemsPerPage
    
    return [skip, itemsPerPage]
}

/**
 * 
 * @param total total de registros
 * @param limit limite de registros por pagina
 * @param current pagina actual
 * @returns @type {[prev, current, next, totalPages]}
 */
const getPageInfo = (total: number, limit: number, current: number) => {
    const totalPages = Math.ceil( total / limit )
    const prev = current ? current - 1 : undefined
    const next = totalPages > (current + 1) ? (current + 1) : undefined 
    return [prev, current, next, totalPages]
}