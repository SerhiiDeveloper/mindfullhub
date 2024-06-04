import { toast } from "react-toastify";
import checkStorageEstimate from "./checkStorageEstimate";

export const saveLocalFileToCache = async (file: File, cacheName: string, _id: string, title: string) => {
    try {
        if (caches) {
            const cache = await caches.open(cacheName)
            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadedFile = new Blob([e.target!.result!], { type: file.type });
                  const encodedTitle = encodeURI(title) || file.name
                const response = new Response(uploadedFile, { headers: { "Content-Type": file.type, "_id": _id, "title": encodedTitle} });
                cache.put(_id, response).then(() => checkStorageEstimate()).then(() => toast.success("Файл збережено"))
            }
            reader.readAsArrayBuffer(file);
        } else {
            throw new Error("Cache API is not supported in this browser")
        }
    } catch (error: any) {
        toast.error(error?.message || "Помилка збереження файлу")
    }
}