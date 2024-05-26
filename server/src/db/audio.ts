import mongoose from "mongoose";

const AudioSchema = new mongoose.Schema({
    src: { type: String, required: true },
    _id: { type: mongoose.Types.ObjectId, required: true},
    title: { type: String, required: true }
})

const AudioListSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    _id: { type: mongoose.Types.ObjectId, required: true},
    audioPlayList: [AudioSchema]
})

export const AudioListModel = mongoose.model("AudioList", AudioListSchema)

export const getAudioList = () => AudioListModel.find({})