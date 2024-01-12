import { Router } from "express";

import { create, getMyReports, getReport } from "./controller";
import { verifySeed } from "./middlewares";
import { getMyReportsValidator, getReportValidator, reportCreateValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";

const router = Router()

router.post('/create', isAuth,
                       can(),
                       reportCreateValidator,
                       verifySeed,
                       create)

router.get('/details/:id',  isAuth,
                            can(),
                            getReportValidator,
                            getReport)

router.get('/my-reports', isAuth,
                          can(),
                          getMyReportsValidator,
                          getMyReports)

export { router }