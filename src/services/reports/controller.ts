import { RequestHandler } from "express";

import { ReportModel } from "./models";

import { User } from "../auth/types";

import lang from "../../lang";
import { paginator } from "../../libs/database";

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
    const authUser = req.user as User
    const pagination = await paginator(ReportModel, { author:  authUser._id}).populate('author')
    return res.json({
        success: true,
        data: pagination,
        status: 200
    })
}