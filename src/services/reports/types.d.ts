import { ObjectId } from "mongoose"
import { modules, reportTypes } from "../../mocks/reports"

export interface Report {
    _id: ObjectId
    author: ObjectId
    title: string
    type: ReportType
    description?: string
    seed?: string
    module?: Module
    status: boolean
}

export type Module =  (typeof modules)[keyof typeof modules]
export type ReportType = (typeof reportTypes) [keyof typeof reportTypes]