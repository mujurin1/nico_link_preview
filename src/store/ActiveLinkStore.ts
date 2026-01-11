import { createStore } from "solid-js/store";
import { connectStorage } from "../utils/connectStorage";
import { ActiveLinkType, ActiveLinkTypes } from "./types";

export const ActiveLinkDefault = Object.freeze({
  // satisfies を指定すると、なぜか true に固定されるので as boolean で回避
  user: true as boolean,
  mylist: true as boolean,
  series: true as boolean,
  video: true as boolean,
  live: true as boolean,
  seiga: true as boolean,
  solid: true as boolean,
} satisfies Record<ActiveLinkType, boolean>);

export const activeLinkStore = createStore({ ...ActiveLinkDefault });
export const [activeLink, setActiveLink] = activeLinkStore;
export type ActiveLinkStore = typeof activeLink;

connectStorage(
  activeLinkStore,
  "ActiveLink",
  safeActiveLink,
);

function safeActiveLink(value: any): ActiveLinkStore | null {
  if (typeof value !== "object" || value == null) return null;

  const result = {} as ActiveLinkStore;

  for (const key of ActiveLinkTypes) {
    if (typeof value[key] !== "boolean") return null;
    result[key] = value[key];
  }

  return result;
}
