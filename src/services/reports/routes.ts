import { Router } from "express";

import { create, getMyReports, getReport } from "./controller";
import { getMyReportsValidator, getReportValidator, reportCreateValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";

const router = Router()

router.use(isAuth, can())

router.post('/create', reportCreateValidator,
                       create)

router.get('/details/:id',  getReportValidator,
                            getReport)

router.get('/my-reports', getMyReportsValidator,
                          getMyReports)

export { router }