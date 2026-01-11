import { createStore } from "solid-js/store";
import { connectStorage } from "../utils/connectStorage";

export const OtherSettingDefault = Object.freeze({
  removeTimer: 0 as number,
  macheSelector: `
// 動画視聴ページの動画リンク
[class=watch]

// 例: プロフィールのマイリスト・シリーズ一覧
// [href$="?ref=pc_mypage_mylist"]
// [href$="?ref=pc_userpage_mylist"]
// [href$="?ref=user_series"]
`.trim(),
});

export const otherSettingStore = createStore({ ...OtherSettingDefault });
export const [otherSetting, setOtherSetting] = otherSettingStore;
export type OtherStore = typeof otherSetting;

connectStorage(
  otherSettingStore,
  "otherSetting",
  safeOther,
);

function safeOther(value: any): OtherStore | null {
  const otherSetting = value as OtherStore;
  if (typeof otherSetting !== "object" || otherSetting == null) return null;
  if (typeof otherSetting.removeTimer !== "number") return null;
  if (typeof otherSetting.macheSelector !== "string") return null;

  return {
    removeTimer: otherSetting.removeTimer,
    macheSelector: otherSetting.macheSelector,
  };
}
