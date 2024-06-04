import { toast } from "react-toastify";

export type StorageEstimateType = {
    usage: number
    quota: number
}
async function checkStorageEstimate(): Promise<Error | StorageEstimateType> {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) {
      console.error('Storage API not supported in this browser');
      return new Error("Помилка оцінки об'єму пам'яті браузера");
    }
  
    try {
      const estimate = await navigator.storage.estimate();
      const usedBytes = estimate.usage;
      const totalBytes = estimate.quota;
      
      if (usedBytes === undefined || totalBytes === undefined) throw new Error('Storage estimate is not available');
      console.log(`Used storage: ${(usedBytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Total available storage: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Available storage: ${((totalBytes - usedBytes) / 1024 / 1024).toFixed(2)} MB`);
      
      toast("Використано пам'яті: " + (usedBytes / 1024 / 1024).toFixed(2) + " MB" + "\n" + "Доступно пам'яті: " + ((totalBytes - usedBytes) / 1024 / 1024).toFixed(2) + " MB");

      return {
        usage: usedBytes,
        quota: totalBytes
      }
    } catch (error) {
      console.error('Error checking storage estimate:', error);
      return new Error("Помилка оцінки об'єму пам'яті браузера");
    }
  }

  export default checkStorageEstimate