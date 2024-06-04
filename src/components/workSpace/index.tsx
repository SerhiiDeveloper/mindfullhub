import { WidgetTypeEnum } from "../../store/activeWidgetStore";
import { WidgetControlPanel } from "../widgetDnD/widgetControlPanel";
import { WidgetDraggableHOC } from "../widgetDnD/widgetDraggableHOC";
import { PlayListController } from "./playListControllers";
import { DataSourceTabMenu } from "./dataSourceTabMenu";
import { useWorkSpaceStore } from "../../store/workSpaceStore";
import { useEffect } from "react";
import { useWorkSpaceVideoStore } from "../../store/workSpaceVideoStore";
import { useWorkSpaceAudioStore } from "../../store/workSpaceAudioStore";
import checkStorageEstimate from "../../store/utils/checkStorageEstimate";

export const WorkSpace = () => {
  const setIsWidgetShow = useWorkSpaceStore((state) => state.setIsWidgetShow);
  const isWidgetShow = useWorkSpaceStore((state) => state.isWidgetShow);
  const updateVideoCached = useWorkSpaceVideoStore(
    (state) => state.updateVideoCached
  );
  const updateAudioCachedById = useWorkSpaceAudioStore(state => state.updateAudioCachedById)
  
  const cachedListener = (event: MessageEvent) => {
    checkStorageEstimate();
    switch (event.data.action) {
      case "cacheAPIVideoData":
        updateVideoCached(event.data.url);
        break;
    
      case "cacheAPIAudioData":
        updateAudioCachedById(event.data.url);
        break;

      default:
        break;
    }
  }
  useEffect(() => {
    navigator?.serviceWorker?.addEventListener("message", cachedListener);
    return () => {
      navigator?.serviceWorker?.removeEventListener("message", cachedListener);
    }
  }, [])

  return (
    <WidgetDraggableHOC
      widgetType={WidgetTypeEnum.WORK_SPACE}
      className={!isWidgetShow ? "hidden" : ""}
    >
      <div className={"w-80 rounded-md bg-white shadow max-h-screen overflow-y-auto"}>
      <WidgetControlPanel
          header="Робоче місце"
          handleClick={setIsWidgetShow}
          widgetType={WidgetTypeEnum.WORK_SPACE}
        />
        <DataSourceTabMenu />
        <PlayListController/>
      </div>
    </WidgetDraggableHOC>
  );
};
