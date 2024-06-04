import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ToastContent, toast } from "react-toastify";

function PWABadge() {
  // check for updates every hour
  const period = 60 * 60 * 1000;

  const {
    // offlineReady: [offlineReady],
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;

      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });
  const close = (callback: () => void) => () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    callback;
  };

  const reload: ToastContent = ({ closeToast }) => (
    <div>
      Доступні нові дані.
      <div className="flex flex-row justify-between items-center mt-1">
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full"
          onClick={() => {
            updateServiceWorker(true);
            closeToast();
          }}
        >
          Перезавантажити
        </button>
        <button 
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
        onClick={close(closeToast)}>Закрити</button>
      </div>
    </div>
  );

  useEffect(() => {
    if (offlineReady) {
      toast.info("Додаток готовий до роботи в офлайн");
    }
    if (needRefresh) {
      toast.warning(reload, {
        autoClose: false,
      });
    }
  }, [offlineReady]);
  return null;
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("connection" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
