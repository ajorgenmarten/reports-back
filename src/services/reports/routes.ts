import { Router } from "express";

import { create, getMyReports, getReport } from "./controller";
import { verifySeed } from "./middlewares";
import { getMyReportsValidator, getReportValidator, reportCreateValidator } from './validator';

import { can, isAuth } from "../auth/middlewares";

import { checkExpressValidatorMiddlewares } from "../../libs/check-express-validator-middlewares";

const router = Router()

router.post('/create', isAuth,
                       checkExpressValidatorMiddlewares(reportCreateValidator),
                       can(),
                       verifySeed,
                       create)

router.get('/details/:id',  isAuth,
                            checkExpressValidatorMiddlewares(getReportValidator),
                            can(),
                            getReport)

router.get('/my-reports', isAuth,
                          checkExpressValidatorMiddlewares(getMyReportsValidator),
                          can(),
                          getMyReports)

export default router