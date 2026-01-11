import { otherSetting } from "./store/OtherSettingStore";
import { createUrl } from "./utils/nico";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

let embedIframe: HTMLIFrameElement | null = null;

function initialize(): void {
  document.addEventListener("mouseover", handleMouseOver);
  document.addEventListener("mouseout", handleMouseOut);
  document.addEventListener("mousedown", handleMouseDown);
}

//#region イベントハンドラ
function handleMouseDown(): void {
  removeIframe();
}

function handleMouseOver(e: MouseEvent): void {
  if (!(e.target instanceof HTMLAnchorElement)) return;
  const url = createUrl(e.target.href);
  if (url == null) return;

  if (!isTarget(e.target)) return;
  removeIframe();

  embedIframe = createEmbedIframe(url, e.pageX + 5, e.pageY + 5);
  document.body.appendChild(embedIframe);
}

function handleMouseOut(): void {
  if (otherSetting.removeTimer === 0) {
    removeIframe();
    return;
  }

  const target = embedIframe;
  setTimeout(() => {
    if (target !== embedIframe) return;
    removeIframe();
  }, otherSetting.removeTimer * 1000);

}
//#endregion イベントハンドラ


function removeIframe(): void {
  if (embedIframe == null) return;
  embedIframe.parentElement?.removeChild(embedIframe);
  embedIframe = null;
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

