import { RequestHandler } from "express";
import webpush from "../../webpush";

export const subscription: RequestHandler = async (req, res) => {
    console.log(req.body)
    await webpush.sendNotification(req.body, JSON.stringify({ message: "Me resingo en to" }))
}