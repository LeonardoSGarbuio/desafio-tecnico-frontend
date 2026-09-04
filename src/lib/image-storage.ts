/**
 * Utilitário de persistência de imagens em IndexedDB com fallback para localStorage.
 * Permite anexar fotos de qualquer tamanho sem restrição de cota da MockAPI ou do navegador.
 */

const DB_NAME = "DragonSanctuaryDB";
const STORE_NAME = "dragon_images";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB não disponível"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Salva uma imagem para o dragão */
export async function setDragonImageLocal(id: string, imageData: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(imageData, id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback: localStorage
    try {
      localStorage.setItem(`@dragon_img_${id}`, imageData);
    } catch {
      // Quota exceeded
    }
  }
}

/** Recupera a imagem de um dragão pelo ID */
export async function getDragonImageLocal(id: string): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result as string);
        } else {
          // Fallback para localStorage
          resolve(localStorage.getItem(`@dragon_img_${id}`));
        }
      };
      req.onerror = () => {
        resolve(localStorage.getItem(`@dragon_img_${id}`));
      };
    });
  } catch {
    return localStorage.getItem(`@dragon_img_${id}`);
  }
}

/** Remove a imagem de um dragão */
export async function deleteDragonImageLocal(id: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(`@dragon_img_${id}`);
  } catch {
    // ignore
  }
}
