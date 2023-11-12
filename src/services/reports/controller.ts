import { RequestHandler } from "express";
import { Report } from "./types";
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