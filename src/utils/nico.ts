import { activeLink } from "../store/ActiveLinkStore";
import { ActiveLinkType, ActiveLinkTypes } from "../store/types";

const NicoUrl = {
  user: "https://ext.nicovideo.jp/thumb_",
  mylist: "https://ext.nicovideo.jp/thumb_",
  series: "https://ext.nicovideo.jp/thumb_",
  video: "https://ext.nicovideo.jp/thumb/",
  live: "https://live.nicovideo.jp/embed/",
  seiga: "https://ext.seiga.nicovideo.jp/thumb/",
  solid: "https://3d.nicovideo.jp/externals/widget?id=",
} as const satisfies Record<ActiveLinkType, string>;


const NicoUrlRegs = {
  user: /(user\/[0-9]+)/,
  mylist: /(mylist\/[0-9]+)/,
  series: /(series\/[0-9]+)/,
  video: /watch\/((?:sm|nm|so)[0-9]+)/,
  seiga: /(im[0-9]+)/,
  live: /(lv[0-9]+)/,
  solid: /(td[0-9]+)/,
} as const satisfies Record<ActiveLinkType, RegExp>;

/**
 * ニコニコのコンテンツIDから、埋め込みURLを生成する
 * @param contentId コンテンツのID
 * @returns 埋め込みURL. または null
 */
export function createUrl(contentId: string): string | null {
  for (const type of ActiveLinkTypes) {
    if (!activeLink[type]) continue;

    const regex = NicoUrlRegs[type];
    const result = contentId.match(regex);

    if (result == null) continue;

    return `${NicoUrl[type]}${result[1]}`;
  }
  return null;
}
