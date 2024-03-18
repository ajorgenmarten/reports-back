import { Request } from "express";
import webpush from "../../webpush";
import { UserModel } from "../auth/models";
import { PushDeviceModel } from "./models";

export const notifyToAdmins = async (req: Request) => {
    const admins = await UserModel.find({ role: "admin" })
    const endPoints = await Promise.all(admins.map( async user => {
        const devices = await PushDeviceModel.find({ user: user._id })
        return devices
    }))

    endPoints.flat().forEach(async endpoint => {
        sendNotification(endpoint, {
            title: req.user?.name + ' ha enviado un nuevo reporte.',
            icon: 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
        })
    })
}

const sendNotification = (endpoint: any, data: any) => {
    webpush.sendNotification(endpoint.info, JSON.stringify(data))
        .catch((reason) => {
            console.error(reason)
            unsubscribe(endpoint.info.endpoint)
        })
}


export const unsubscribe = async (endpoint: string) => {
    await PushDeviceModel.deleteOne({ 'info.endpoint': endpoint })
}