import { RequestHandler } from "express";

import { ReportModel } from "./models";
import { Report } from "./types";

import { User } from "../auth/types";

import lang from "../../lang";
import { paginator } from "../../libs/database";
import { handleResponse } from "../../libs/http";
import { getMyReports } from "./helper";

export const create: RequestHandler = async (req, res) => {
    let report = req.body as Report
    report.author = (req.user as User)._id
    report = await ReportModel.create(report)

    return handleResponse(res, {
        success: true,
        data: report,
        message: lang.services.reports.controllers.createOk,
    })
}

export const getReport: RequestHandler = async (req, res) => {
    const report = await ReportModel.findOne({ _id: req.params.id }).populate('author')
    return report ? handleResponse(res, { success: false, message: lang.services.reports.controllers.getReportNotFound, status: 404 })
        : handleResponse(res, { success: true, data: report })
}

export const myReports: RequestHandler = async (req, res) => {
    const authUser = req.user as User
    try {
        // const pagination = await paginator(ReportModel, { author: authUser._id }, { page: req.query.page as string, population: ['author'] })
        let page: any = req.query.page
        if ( page ) page = parseInt(page as string)
        const data = await getMyReports(authUser._id, page ?? undefined)
        return handleResponse(res, { success: true, data })
    } catch (er: any) {
        return handleResponse(res, { success: false, message: er.message, status: 500 })
    }
}

export const getAllReports: RequestHandler = async (req, res) => {
    try {
        const pagination = await paginator(ReportModel, {}, { page: req.query.page as string, population: ['author'] })
        return handleResponse(res, { success: true, data: pagination })
    } catch (er: any) {
        return handleResponse(res, { success: false, message: er, status: 500 })
    }
}