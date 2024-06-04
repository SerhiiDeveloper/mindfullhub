
export interface ILocalList {
    src: string;
    _id: string;
    title: string;
}

export async function getLocalListFromCache(cacheName: string) {
    if (!caches) return []
    const cache = await caches.open(cacheName)
    const responses = await cache.matchAll();
    if (responses) {
        const list: ILocalList[] = []
        const listBlob = await Promise.all(responses.map(response => {
            list.push({
                src: "",
                _id: response.headers.get("_id") || "",
                title: decodeURI(response.headers.get("title") || "") || "",
            })
            return response.blob()
        }))
        listBlob.forEach((item, index) => {
            list[index].src = URL.createObjectURL(item)
        })

        return list
    }
    return []
}