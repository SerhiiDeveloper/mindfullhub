import { getVideoListController } from "../controller/videoList";
import { Router } from "express";

export default (router: Router) => {
    router.get("/video-list", getVideoListController)
}