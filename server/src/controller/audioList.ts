import { getAudioList } from "../db/audio"
import { Request, Response } from "express"
export const getAudioListController = async (req: Request, res: Response) => {
    try {
        const audioList = await getAudioList()
        if (!audioList) {
            throw new Error("audio list doesn't exist")
        }
        return res.status(200).json(audioList).end();
    } catch (error) {
        console.log(error)
        res.sendStatus(400)
    }
}