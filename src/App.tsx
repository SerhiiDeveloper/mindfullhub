import { useState, useEffect } from "react";
import { Button } from "./components/button";
import { HomePage } from "./pages/home";
import PWABadge from "./PWABadge";
import OfflineSVG from "./assets/svg/offline.svg";
import { useWorkSpaceStore } from "./store/workSpaceStore";

function App() {
  const setIsOffline = useWorkSpaceStore((state) => state.setIsOffline);
  const isOffline = useWorkSpaceStore((state) => state.isOffline);
  const [cached, setcached] = useState(false);

  const listenerOnline = () => {
    console.log("online")
    setIsOffline(false);
  };
  const listenerOffline = () => {
    console.log("offline")
    setIsOffline(true);
  };

  useEffect(() => {
    window.addEventListener("online", listenerOnline);
    window.addEventListener("offline", listenerOffline);

    return () => {
      window.removeEventListener("online", listenerOnline);
      window.removeEventListener("offline", listenerOffline);
    };
  }, []);

  const cacheData = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        action: "cacheData",
      });
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log(event.data);
        setcached(true);
      });
    }
  };

  return (
    <>
      {isOffline && (
        <div className="p-1 border-2 shrink-0 rounded-full border-red-500 w-12 h-12 fixed top-1 right-1 z-50 bg-red-400">
          <img src={OfflineSVG} alt="Веб застосунок офлайн" />
        </div>
      )}
      <PWABadge />
      <HomePage />
      {/* <div className="absolute top-1/2 left-1/2 z-50">
        <Button onClick={cacheData} className={cached ? "text-red-500" : ""}>
          Push Cache
        </Button>
      </div> */}
    </>
  );
}

export default App;
