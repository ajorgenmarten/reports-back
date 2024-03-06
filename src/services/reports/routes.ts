import { Router } from "express";

import { complete, create, getReport, myReports, remove } from "./controller";
import { getMyReportsValidator, getReportValidator, reportCreateValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";

const router = Router()

router.use(isAuth, can())

router.post('/create', reportCreateValidator,
                       create)

router.get('/details/:id',  getReportValidator,
                            getReport)

router.get('/my-reports', getMyReportsValidator,
                          myReports)

router.put('/complete/:id', getReportValidator,
                            complete )

router.delete('/delete/:id', getReportValidator,
                             remove)

export { router }