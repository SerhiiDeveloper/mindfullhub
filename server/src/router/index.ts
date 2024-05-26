import { Router } from 'express'
import videoListRouter from './videoListRouter';
import audioListRouter from './audioListRouter';

const router = Router()

export default (): Router => {
    videoListRouter(router);
    audioListRouter(router)
    return router;
}