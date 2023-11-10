import { ObjectId } from "mongoose"

export interface Report {
    author: ObjectId
    title: string
    type: ReportType
    description?: string
    seed?: string
    status: boolean
}

export type ReportType = {
    name: string
    codstr: string
}