import { getAudioListController } from "../controller/audioList";
import { Router } from "express";

export default (router: Router) => {
    router.get("/audio-list", getAudioListController)
}