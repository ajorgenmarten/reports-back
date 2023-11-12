import { RequestHandler } from "express";

import { ReportModel } from "./models";

import { User } from "../auth/types";

import lang from "../../lang";

export const create: RequestHandler = async (req, res) => {
    const report = new ReportModel(req.body)
    report.author = (req.user as User)._id
    await report.save()
    res.json({
        success: true,
        data: report,
        message: lang.services.reports.controllers.createOk,
        status: 200
    })
}

export const getReport: RequestHandler = async (req, res) => {
    const report = await ReportModel.findOne({_id: req.params.id}).populate('author')
    return res.json({
        success: true,
        data: { report },
        status: 200
    })
}

export const getMyReports: RequestHandler = async (req, res) => {
    const itemsPerPages = 40
    const page = req.query.page as string ?? 1
    const startIndex = parseInt( page ) - 1
    const authUser = req.user as User
    const reports = await ReportModel.find({ author: authUser._id }).populate('author').skip(startIndex * itemsPerPages).limit(40)
    return res.json({
        success: true,
        data: { reports },
        status: 200
    })
}