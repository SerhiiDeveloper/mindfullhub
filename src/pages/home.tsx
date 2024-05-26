import BG_Video from "../components/home/bg_video_wrapper";
import { NavBar } from "../components/navBar/navBar";
import { Tasks } from "../components/tasks";
import { Timer } from "../components/timer";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { WidgetDroppableArea } from "../components/widgetDnD/widgetDroppableArea";
import {
  WidgetTypeEnum,
  useActiveWidgetStore,
} from "../store/activeWidgetStore";
import { WorkSpace } from "../components/workSpace";
import { BreathWidget } from "../components/breathWidget";

export function HomePage() {
  const setWidgetPosition = useActiveWidgetStore(
    (state) => state.setWidgetPosition
  );
  const setActiveWidget = useActiveWidgetStore(
    (state) => state.setActiveWidget
  );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveWidget(event.active.id as WidgetTypeEnum);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const widgetWidth = 320;
    const widgetHeight = 206;
    let dropPositionX = event.delta.x + event.active.data.current?.x;
    let dropPositionY = event.delta.y + event.active.data.current?.y;
    if (dropPositionX < 0) dropPositionX = 0;
    if (dropPositionY < 0) dropPositionY = 0;

    const droppableAreaMaxY = window.innerHeight - widgetHeight;
    if (dropPositionY > droppableAreaMaxY) dropPositionY = droppableAreaMaxY;

    if (event.over) {
      const droppableAreaMaxX = event.over.rect.width - widgetWidth;
      if (dropPositionX > droppableAreaMaxX) dropPositionX = droppableAreaMaxX;
    }

    setWidgetPosition(
      dropPositionX,
      dropPositionY,
      event.active.id as WidgetTypeEnum
    );
  };
  return (
    <div className="flex bg-slate-800 justify-start items-start h-screen w-screen flex-row">
      <NavBar />
      <main className="relative flex-auto h-screen overflow-hidden">
        <BG_Video />
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <WidgetDroppableArea />
            <Timer />
          <Tasks />
          <WorkSpace />
        </DndContext>
        <BreathWidget />
      </main>
    </div>
  );
}
