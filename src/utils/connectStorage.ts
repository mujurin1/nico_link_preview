import { trackStore } from "@solid-primitives/deep";
import { createEffect, createRoot, on } from "solid-js";
import { SetStoreFunction, Store } from "solid-js/store";

/**
 * solidjs の store と chrome.storage を連携させる
 * @param param0 solidJs の store
 * @param storageKey chrome.storage に保存するキー
 * @param safeTransform ストレージから読み込んだデータを安全に変換する関数
 * @param storageArea 使用するストレージエリア（"local" または "sync"）
 */
export function connectStorage<T extends object = {},>(
  [store, setStore]: [get: Store<T>, set: SetStoreFunction<T>],
  storageKey: string,
  safeTransform: (value: any) => T | null,
): void {
  let saving = false;

  // データ保存
  createRoot(() => {
    createEffect(
      on(
        () => trackStore(store),
        (value) => {
          saving = true;
          const safeValue = safeTransform(value);
          chrome.storage.local.set({ [storageKey]: safeValue })
            .finally(() => saving = false);
        },
        { defer: true }
      )
    );
  });

  // 初期データ読み込み
  chrome.storage.local.get(storageKey, (data) => {
    const value = safeTransform(data[storageKey]);
    if (value == null) return;
    setStore(value);
  });

  // データ変更監視
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (saving) return;
    if (namespace === "local" && storageKey in changes) {
      const newValue = changes[storageKey].newValue as T;
      setStore(newValue);
    }
  });
}
