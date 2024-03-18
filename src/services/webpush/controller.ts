import { RequestHandler } from "express";
import { PushDeviceModel } from "./models";
import { handleResponse } from "../../libs/http";
import lang from "../../lang";

export const subscription: RequestHandler = async (req, res) => {
    const pushInfo = req.body
    const exist = await PushDeviceModel.findOne({ 'info.endpoint': pushInfo.endpoint })

    if ( exist ) {
        return handleResponse(res, {
            success: true,
            message: lang.services.webpush.controllers.deviceWasAdded
        })
    }

    await PushDeviceModel.create({
        user: req.user?._id,
        info: pushInfo
    })

    return handleResponse(res, {
        success: false,
        message: lang.services.webpush.controllers.deviceAdded
    })
}