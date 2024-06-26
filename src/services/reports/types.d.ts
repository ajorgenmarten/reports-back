import { ObjectId } from "mongoose"
import { modules, reportTypes } from "../../mocks/reports"

export interface Report {
    _id: ObjectId
    author: ObjectId
    title: string
    type: ReportType
    description?: string
    department: String
    seed?: string
    module?: Module
    status: boolean
    solution: string
}

export type Module =  (typeof modules)[keyof typeof modules]
export type ReportType = (typeof reportTypes) [keyof typeof reportTypes]