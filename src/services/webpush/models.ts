import { Schema, SchemaTypes, model } from "mongoose";
import { PushDevice } from "./types";

const pushDeviceSchema = new Schema<PushDevice>({
    info: SchemaTypes.Mixed,
    user: { ref: 'users', type: SchemaTypes.ObjectId }
}, {
    timestamps: true,
    versionKey: false,
})

export const PushDeviceModel = model('pushdevices', pushDeviceSchema)