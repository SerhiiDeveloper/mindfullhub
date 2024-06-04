import { useEffect } from "react";
import { HomePage } from "./pages/home";
import PWABadge from "./PWABadge";
import OfflineSVG from "./assets/svg/offline.svg";
import { useWorkSpaceStore } from "./store/workSpaceStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const setIsOffline = useWorkSpaceStore((state) => state.setIsOffline);
  const isOffline = useWorkSpaceStore((state) => state.isOffline);

  const listenerOnline = () => {
    setIsOffline(false);
  };
  const listenerOffline = () => {
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

  return (
    <>
      {/* {isOffline && ( */}
      <div
        className={
          "p-1 border-2 shrink-0 rounded-full border-red-500 w-12 h-12 fixed top-1 right-1 z-50 bg-red-400 " +
          (isOffline ? "" : "hidden")
        }
      >
        <img src={OfflineSVG} alt="Веб застосунок офлайн" />
      </div>
      {/* )} */}
      <PWABadge />
      <HomePage />
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      // transition="Bounce"
      />
    </>
  );
}

export default App;
