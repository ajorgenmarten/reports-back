import { RequestHandler } from "express";
import { typeReports } from '../../mocks/reports'
import { Report } from "./types";
import lang from "../../lang";

export const verifySeed: RequestHandler = (req, res, next) => {
    const report = req.body as Report
    if( report.type.codstr ==  typeReports[0].codstr) {
        if ( !report.seed ) return res.status(400).json({
            success: false,
            message: lang.services.reports.middlewares.verifySeedNotSend,
            status: 400
        })
    }
    for (const typeReport of typeReports) {
        if (typeReport.codstr == report.type.codstr) return next()
    }
    return res.status(400).json({
        success: false,
        message: lang.services.reports.middlewares.verifySeedNotMatch,
        status: 400
    })
}