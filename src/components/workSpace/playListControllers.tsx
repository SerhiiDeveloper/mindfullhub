import { useState } from "react";
import { AudioPlayListController } from "./audioPlayListController";
import { VideoPlayListController } from "./videoPlayListController";
import { LocalAudioListController } from "./localAudioListController";
import { LocalVideoListController } from "./localVideoListController";
// import { LocalImageListController } from "./localImageListController";
import { useWorkSpaceStore } from "../../store/workSpaceStore";
import { AudioController } from "./audioController";

export const PlayListController = () => {
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(0);
  const isLocal = useWorkSpaceStore((state) => state.isLocal);
  const tabs = [
    {
      title: "Фонове відео",
      component: isLocal ? (
        <LocalVideoListController />
      ) : (
        <VideoPlayListController />
      ),
    },
    {
      title: "Фонова музика",
      component: isLocal ? (
        <LocalAudioListController />
      ) : (
        <AudioPlayListController />
      ),
    },
    // isLocal
    //   ? { title: "Фонове зображення", component: <LocalImageListController /> }
    //   : null,
  ];

  const handleTabClick = (index: number) => () => {
    if (index === activeTabIndex) return setActiveTabIndex(null);
    setActiveTabIndex(index);
  };

  return (
    <>
      {tabs.map((tab, index) => {
        if (!tab) return;
        return (
          <div className="p-2 px-6" key={tab.title}>
            <h3
              onClick={handleTabClick(index)}
              className={
                "p-1 text-lg cursor-pointer hover:bg-gray-400 " +
                (activeTabIndex === index ? "bg-gray-300" : "bg-white")
              }
            >
              {tab.title}
            </h3>
            <ul
              className={
                "p-1 max-h-56 overflow-y-auto transition-all duration-500 ease-in-out " +
                (activeTabIndex === index
                  ? "h-56 opacity-100"
                  : "h-0 opacity-0")
              }
            >
              {tab.component}
            </ul>
          </div>
        );
      })}
      <AudioController isLocal={isLocal}/>
    </>
  );
};
