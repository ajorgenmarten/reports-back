import { ObjectId } from "mongoose"

export interface Report {
    _id: ObjectId
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