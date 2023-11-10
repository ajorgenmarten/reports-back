import { Schema, SchemaTypes, model } from "mongoose";
import { Report, ReportType } from "./types";

const reportTypeSchema = new Schema<ReportType>({
    codstr: SchemaTypes.String,
    name: SchemaTypes.String
}, {
    versionKey: false,
    timestamps: false,
    _id: false,
})

const reportSchema = new Schema<Report>({
    author: { type: SchemaTypes.ObjectId, ref: 'users', required: true },
    description: SchemaTypes.String,
    seed: SchemaTypes.String,
    title: SchemaTypes.String,
    type: {type: reportTypeSchema, required: true},
    status: SchemaTypes.Boolean
}, {
    versionKey: false,
    timestamps: true,
})

export const ReportModel = model<Report>('reports', reportSchema)