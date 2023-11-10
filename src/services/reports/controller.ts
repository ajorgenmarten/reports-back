import { RequestHandler } from "express";

export const create: RequestHandler = async (req, res) => {
    res.json(req.body)
}