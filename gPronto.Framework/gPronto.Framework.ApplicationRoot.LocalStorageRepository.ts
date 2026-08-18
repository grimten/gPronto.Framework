import {
  decodeGProntoFrameworkApplicationRootLocalStorage,
  encodeGProntoFrameworkApplicationRootLocalStorage,
} from "./gPronto.Framework.ApplicationRoot.LocalStorageCodec";
import type { GProntoFrameworkApplicationRootPublicPropertiesState } from "./gPronto.Framework.ApplicationRoot.PublicPropertiesStateContract";

const LOCAL_STORAGE_KEY = "gPronto.Framework.LocalStorage";

type StoredStateListener = (
  state: GProntoFrameworkApplicationRootPublicPropertiesState,
) => void;

function createLocalStorageError(operation: string, cause: unknown): Error {
  return new Error(
    `gPronto.Framework could not ${operation} ${LOCAL_STORAGE_KEY}.`,
    { cause },
  );
}

function getBrowserLocalStorage(): Storage {
  try {
    if (typeof window === "undefined") {
      throw new Error("The browser window is unavailable.");
    }

    return window.localStorage;
  } catch (error) {
    throw createLocalStorageError("access", error);
  }
}

function setStoredValue(storedValue: string): void {
  try {
    getBrowserLocalStorage().setItem(LOCAL_STORAGE_KEY, storedValue);
  } catch (error) {
    throw createLocalStorageError("write", error);
  }
}

export function readGProntoFrameworkApplicationRootStoredState(): GProntoFrameworkApplicationRootPublicPropertiesState {
  let storedValue: string | null;

  try {
    storedValue = getBrowserLocalStorage().getItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    throw createLocalStorageError("read", error);
  }

  const decodedValue =
    decodeGProntoFrameworkApplicationRootLocalStorage(storedValue);

  if (decodedValue.RequiresWrite) {
    setStoredValue(
      encodeGProntoFrameworkApplicationRootLocalStorage(decodedValue.State),
    );
  }

  return decodedValue.State;
}

export function writeGProntoFrameworkApplicationRootStoredState(
  state: GProntoFrameworkApplicationRootPublicPropertiesState,
): void {
  let storedValue: string;

  try {
    storedValue = encodeGProntoFrameworkApplicationRootLocalStorage(state);
  } catch (error) {
    throw createLocalStorageError("serialize", error);
  }

  setStoredValue(storedValue);
}

export function subscribeToGProntoFrameworkApplicationRootStoredState(
  listener: StoredStateListener,
): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea !== getBrowserLocalStorage()) {
      return;
    }

    if (event.key !== LOCAL_STORAGE_KEY && event.key !== null) {
      return;
    }

    listener(readGProntoFrameworkApplicationRootStoredState());
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
  };
}
