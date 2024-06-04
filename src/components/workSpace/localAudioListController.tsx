import { useEffect } from "react";
import { useWorkSpaceLocalStore } from "../../store/workSpaceLocalStore";
import { AddLocalFilesForm } from "./addLocalFilesForm";
import { LocalListItem } from "./localListItem";

export const LocalAudioListController = () => {
  const audioList = useWorkSpaceLocalStore((state) => state.audioList);
  const activeAudioId = useWorkSpaceLocalStore((state) => state.activeAudioId);
  const addAudio = useWorkSpaceLocalStore((state) => state.addAudio);
  const getAudioListFromCache = useWorkSpaceLocalStore(
    (state) => state.getAudioListFromCache
  );
  const setActiveAudioId = useWorkSpaceLocalStore(
    (state) => state.setActiveAudioId
  );
  const deleteAudioById = useWorkSpaceLocalStore(
    (state) => state.deleteAudioById
  );

  useEffect(() => {
    getAudioListFromCache();
  }, []);

  return (
    <ul className="transition-transform duration-500 ease-in-out flex flex-col gap-1 ">
      <AddLocalFilesForm saveFileCallback={addAudio} inputAccept="audio/mp3" />

      {audioList.map((audio) => (
        <LocalListItem
          key={audio._id}
          {...audio}
          activeId={activeAudioId}
          clickHandler={setActiveAudioId}
          deleteHandler={deleteAudioById}
        />
      ))}
    </ul>
  );
};
