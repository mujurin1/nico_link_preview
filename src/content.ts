import { otherSetting } from "./store/OtherSettingStore";
import { createUrl } from "./utils/nico";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

function initialize(): void {
  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mousedown", handleMouseDown);
}

const hoverdDelayTimeMs = 200;

//#region インターフェース
/**
 * ホバーして iframe を作成前
 */
interface HoverState_Before {
  state: "before";
  target: HTMLAnchorElement;
  cancel(): void;
}

/**
 * ホバーして iframe が作成されたら
 */
interface HoverState_Created {
  state: "created";
  isDeleteScheduled: boolean;
  target: HTMLAnchorElement;
  iframe: HTMLIFrameElement;
  destroy(): void;
}

type HoverState = HoverState_Before | HoverState_Created;
//#endregion インターフェース

let hoveredState: HoverState | null = null;


//#region イベントハンドラ
function handleMouseOver(e: MouseEvent): void {
  if (
    hoveredState == null ||
    hoveredState.state === "created" && hoveredState.isDeleteScheduled
  ) createOnHover(e);
  else destroyOnHover(e);
}

function handleMouseDown(): void {
  removeIframe();
}

function createOnHover(e: MouseEvent): void {
  if (!(e.target instanceof HTMLAnchorElement)) return;
  const url = createUrl(e.target.href);
  if (url == null) return;

  if (!isTarget(e.target)) return;
  removeIframe();

  const rect = e.target.getBoundingClientRect();
  const x = window.pageXOffset + rect.x;
  const y = window.pageYOffset + rect.y + rect.height;

  const timerId = setTimeout(() => {
    const iframe = createEmbedIframe(url, x, y);
    document.body.appendChild(iframe);

    hoveredState = {
      state: "created",
      isDeleteScheduled: false,
      target: e.target as HTMLAnchorElement,
      iframe,
      destroy: () => iframe.parentElement?.removeChild(iframe),
    };
  }, hoverdDelayTimeMs);

  hoveredState = {
    state: "before",
    target: e.target as HTMLAnchorElement,
    cancel: () => clearTimeout(timerId),
  };
}

function destroyOnHover(e: MouseEvent): void {
  if (hoveredState == null) return;

  switch (hoveredState.state) {
    case "before": {    // iframe の作成を解除する
      if (e.target === hoveredState.target) return;
      removeIframe();
      break;
    }
    case "created": {   // 作成した iframe を削除する
      if (e.target === hoveredState.target) return;
      if (e.target === hoveredState.iframe) return;

      // 即時削除
      if (otherSetting.removeTimer === 0) {
        removeIframe();
        return;
      }

      // 一定時間後に削除
      hoveredState.isDeleteScheduled = true;
      const target = hoveredState;
      setTimeout(() => {
        if (target !== hoveredState) return;
        removeIframe();
      }, otherSetting.removeTimer * 1000);
      break;
    }
  }
}
//#endregion イベントハンドラ


function removeIframe(): void {
  if (hoveredState == null) return;

  if (hoveredState.state === "before") {
    hoveredState.cancel();
  } else {
    hoveredState.destroy();
  }

  hoveredState = null;
}

function createEmbedIframe(url: string, x: number, y: number): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.position = "absolute";
  iframe.style.overflow = "clip";
  iframe.style.border = "none";
  iframe.style.width = "350px";
  iframe.style.height = "200px";
  iframe.style.left = `${x}px`;
  iframe.style.top = `${y}px`;
  iframe.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;

  return iframe;
}

function isTarget(target: HTMLAnchorElement): boolean {
  if (target.classList.length === 0) return true;

  for (const query of otherSetting.macheSelector.split(/\r\n|\n|\r/)) {
    if (query.trim() === "") continue;
    if (query.trim().startsWith("//")) continue;
    if (target.matches(query)) return true;
  }

  return false;
}
