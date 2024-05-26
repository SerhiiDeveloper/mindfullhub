import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    src: { type: String, required: true },
    _id: { type: mongoose.Types.ObjectId, required: true},
    title: { type: String, required: true }
})

const VideoListSchema = new mongoose.Schema({
    poster: { type: String, required: true },
    icon: { type: String, required: true },
    title: { type: String, required: true },
    video: [VideoSchema]
})

export const VideoListModel = mongoose.model("VideoList", VideoListSchema)

export const getVideoList = () => VideoListModel.find({})