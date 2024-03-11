import { Schema, SchemaTypes, model } from "mongoose";
import { Report, ReportType } from "./types";

const reportSchema = new Schema<Report>({
    author: { type: SchemaTypes.ObjectId, ref: 'users', required: true },
    description: SchemaTypes.String,
    department: SchemaTypes.String,
    seed: SchemaTypes.String,
    title: SchemaTypes.String,
    type: SchemaTypes.String,
    status: {type: SchemaTypes.Boolean, default: false},
    solution: {type: SchemaTypes.String, default: ''}, 
    module: SchemaTypes.String
}, {
    versionKey: false,
    timestamps: true,
})

export const ReportModel = model<Report>('reports', reportSchema)