import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from "react";
import DeleteSVG from "../../assets/svg/delete.svg";
import UploadSVG from "../../assets/svg/download.svg";
import SaveSVG from "../../assets/svg/downloaded.svg";
import { useWorkSpaceLocalStore } from "../../store/workSpaceLocalStore";
import { SvgController } from "../svgController";

export const LocalVideoListController = () => {
  const videoList = useWorkSpaceLocalStore((state) => state.videoList);
  const activeVideoId = useWorkSpaceLocalStore((state) => state.activeVideoId);
  const addVideo = useWorkSpaceLocalStore((state) => state.addVideo);
  const getVideoListFromCache = useWorkSpaceLocalStore(state => state.getVideoListFromCache)
  const setActiveVideoId = useWorkSpaceLocalStore(state => state.setActiveVideoId)
  const deleteVideoById = useWorkSpaceLocalStore(state => state.deleteVideoById)
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getVideoListFromCache();
  }, [])

  const handleSubmit = () => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = titleInputRef.current?.value;
    if (!title || !file) return;
    addVideo(file, title);
    setFile(null);
    if (titleInputRef.current?.value) titleInputRef.current.value = ""
    if (fileInputRef.current) {
        titleInputRef.current.files = null
        titleInputRef.current.value = ""
    }
  };

  const handleVideoClick = (id: string) => () => {
    setActiveVideoId(id)
  }
  const handleDelete = (id: string) => () => {
    deleteVideoById(id)
  }
  const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if (file) setFile(file);
  }
  return (
    <ul className="transition-transform duration-500 ease-in-out flex flex-col gap-1 ">
      <form
        onSubmit={handleSubmit()}
        className="flex flex-row items-center justify-start"
      >
        <label
          htmlFor="upload_video_file"
          className={"border-2 py-1 " + (file ? "border-gray-500" : "border-red-500")}
        >
          <SvgController src={UploadSVG} alt="Добавити файл" />
        </label>
        <input
          accept="video/mp4"
          ref={fileInputRef}
          type="file"
          className="hidden"
          id="upload_video_file"
          name="upload_video_file"
          onChange={handleSelectFile}
        />
        <input
          ref={titleInputRef}
          placeholder="Назва файлу"
          required
          type="text"
          className="w-full bg-white border-2 border-gray-500 rounded p-2"
        />
        <button type="submit" className="border-0 bg-white">
          <SvgController src={SaveSVG} alt="Зберегти" />
        </button>
      </form>
      {videoList.map((video) => (
        <li
          key={video._id}
          className={
            "flex flex-row justify-between items-center p-2 border-2 cursor-pointer hover:bg-gray-100 " +
            (activeVideoId === video._id ? "border-gray-500" : "border-white")
          }
onClick={handleVideoClick(video._id)}
        >
          <p>{video.title}</p>
          <SvgController src={DeleteSVG} alt="Видалити з кешу" onClick={handleDelete(video._id)}/>
        </li>
      ))}
    </ul>
  );
};
