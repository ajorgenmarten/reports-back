import { RequestHandler } from "express";
import webpush from "../../webpush";

export const subscription: RequestHandler = async (req, res) => {
    await webpush.sendNotification(req.body, JSON.stringify({ message: "Hola, bienvenido a reportes thaba" }))
}