import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";
import { useBreathWidgetStore } from "../../store/breathWidgetStore";
import { SizeType, SvgController } from "../svgController";
import MinusSVG from "../../assets/svg/minus.svg";
import { useState } from "react";

export const BreathWidget = () => {
  const { isBreathShow, setIsBreathShow } = useBreathWidgetStore((state) => ({
    isBreathShow: state.isWidgetShow,
    setIsBreathShow: state.setIsWidgetShow,
  }));
  const [isInhaled, setIsInhaled] = useState(true);
  const interval = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      setIsInhaled(true)
      clearInterval(interval.current!);
    };
  }, [isBreathShow]);

  const handleAnimationStart = () => {
    interval.current = setInterval(() => {
      setIsInhaled((prevState) => !prevState);
    }, 5000);
  };

  if (!isBreathShow) return;
  const BreathModal = (
    <div className="w-screen h-screen bg-white absolute left-0 top-0 z-50 flex justify-center items-center">
      <SvgController
        src={MinusSVG}
        alt="Згорнути"
        onClick={setIsBreathShow}
        size={SizeType.LG}
        className=" absolute top-3 right-5"
      />
      <div className="w-[75vh] h-[75vh] flex justify-center items-center relative">
        <span className="w-full h-full bg-blue-200 opacity-30 rounded-full absolute" />
        <span
          className="w-3/4 h-3/4 bg-blue-300 opacity-100 rounded-full absolute animate-breath"
          onAnimationStart={handleAnimationStart}
        />
        <div className="rounded-full bg-blue-300 flex justify-center items-center w-20 h-20 z-10">
          <span className="text-lg font-semibold">
            {isInhaled ? "Вдих" : "Видих"}
          </span>
        </div>
      </div>
    </div>
  );
  return createPortal(BreathModal, document.getElementById("portal")!);
};