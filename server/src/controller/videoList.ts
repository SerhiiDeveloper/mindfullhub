import { getVideoList } from "../db/video"
import { Request, Response } from "express"
export const getVideoListController = async (req: Request, res: Response) => {
    try {
        const videoList = await getVideoList()
        if (!videoList) {
            throw new Error("video list doesn't exist")
        }
        res.set('X-Is-Cacheable', 'true')
        res.set("content-type", "application/json; charset=utf-8")
        return res.status(200).json(videoList).end();
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
}