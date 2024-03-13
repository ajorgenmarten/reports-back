import { RequestHandler } from "express";
import { ReportModel } from "./models";
import { handleResponse } from "../../libs/http";
import lang from "../../lang";

export const itsMine: RequestHandler = async (req, res, next) => {
    if (req.user?.role == 'admin') return next()
    const verify = await ReportModel.find({ _id: req.params.id, author: req.user?._id }).count()
    if (!verify) return handleResponse(res, {
        success: false,
        message: lang.services.reports.middlewares.isNotMine
    })
    next()
}