import { useEffect } from "react";
import { useWorkSpaceLocalStore } from "../../store/workSpaceLocalStore";
import { AddLocalFilesForm } from "./addLocalFilesForm";
import { LocalListItem } from "./localListItem";

export const LocalVideoListController = () => {
  const videoList = useWorkSpaceLocalStore((state) => state.videoList);
  const activeVideoId = useWorkSpaceLocalStore((state) => state.activeVideoId);
  const addVideo = useWorkSpaceLocalStore((state) => state.addVideo);
  const getVideoListFromCache = useWorkSpaceLocalStore(state => state.getVideoListFromCache)
  const setActiveVideoId = useWorkSpaceLocalStore(state => state.setActiveVideoId)
  const deleteVideoById = useWorkSpaceLocalStore(state => state.deleteVideoById)

  useEffect(() => {
    getVideoListFromCache();
  }, [])

  return (
    <ul className="transition-transform duration-500 ease-in-out flex flex-col gap-1 ">
      <AddLocalFilesForm saveFileCallback={addVideo} inputAccept="video/mp4"/>
      
      {videoList.map((video) => (
        <LocalListItem key={video._id} {...video} activeId={activeVideoId} clickHandler={setActiveVideoId} deleteHandler={deleteVideoById}/>
      ))}
    </ul>
  );
};
