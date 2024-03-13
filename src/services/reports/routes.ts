import { Router } from "express";

import { all, complete, create, getReport, myReports, remove, solution } from "./controller";
import { validatePage, getReportValidator, reportCreateValidator, solutionValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";
import { itsMine } from "./middlewares";

const router = Router()

router.use(isAuth, can())

router.post('/create', reportCreateValidator,
                       create)

router.get('/details/:id',  getReportValidator,
                            itsMine,
                            getReport)

router.get('/my-reports', validatePage,
                          myReports)

router.get('/all', validatePage,
                    all)

router.put('/complete/:id', getReportValidator,
                            itsMine,
                            complete )

router.delete('/delete/:id', getReportValidator,
                             itsMine,
                             remove)

router.put('/solution/:id', getReportValidator,
                             solutionValidator,
                             solution)

export { router }