import { RequestHandler } from "express";

import { ReportModel } from "./models";

import { User } from "../auth/types";

import lang from "../../lang";
import { paginator } from "../../libs/database";
import { handleError, handleResponse } from "../../libs/http";

export const create: RequestHandler = async (req, res) => {
    const report = new ReportModel(req.body)
    report.author = (req.user as User)._id
    await report.save()
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

export const getMyReports: RequestHandler = async (req, res) => {
    const authUser = req.user as User
    try {
        const pagination = await paginator(ReportModel, { author: authUser._id }, { page: req.query.page as string, population: ['author'] })
        return handleResponse(res, { success: true, data: pagination })
    } catch (er: any) {
        return handleError(res, { error: er, status: 500 })
    }
}

export const getAllReports: RequestHandler = async (req, res) => {
    try {
        const pagination = await paginator(ReportModel, {}, { page: req.query.page as string, population: ['author'] })
        return handleResponse(res, { success: true, data: pagination })
    } catch (er: any) {
        return handleError(res, { error: er, status: 500 })
    }
}