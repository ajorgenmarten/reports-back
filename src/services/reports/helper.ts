import { ObjectId } from "mongoose"
import { ReportModel } from "./models"
import lang from "../../lang";

export const getMyReports = async ( userId: ObjectId, page: number = 1 ) => {
    if (page < 0) throw new Error(lang.services.reports.helper.getMyReportPageError);
    
    const itemsPerPage = 2
    const skip = page * itemsPerPage

    const totalRegisters = await ReportModel.find({ author: userId }).count()
    const totalPages = Math.ceil( totalRegisters / itemsPerPage)
    const reports = await ReportModel.find({author: userId}).skip(skip).limit(itemsPerPage)

    const prev = page ? page : undefined
    const current = page
    const next = totalPages > (page + 1) ? (page + 1) : undefined

    return { reports, pagination: { prev, next, current, total: totalPages, totalRegisters } }
}