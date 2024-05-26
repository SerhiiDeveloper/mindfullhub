import { useWorkSpaceStore } from "../../store/workSpaceStore";
import { TextButton } from "../textButton";

export const DataSourceTabMenu = () => {
  const isLocal = useWorkSpaceStore((state) => state.isLocal);
  const setIsLocal = useWorkSpaceStore((state) => state.setIsLocal);
  const handleTabClick = (state: boolean) => () => setIsLocal(state);
  return (
    <div className="p-2 px-6 border-b-2 border-gray-300 flex flex-row justify-between items-center">
      <TextButton active={!isLocal} onClick={handleTabClick(false)}>
        Публічні файли
      </TextButton>
      <TextButton active={isLocal} onClick={handleTabClick(true)}>
        Мої файли
      </TextButton>
    </div>
  );
};
