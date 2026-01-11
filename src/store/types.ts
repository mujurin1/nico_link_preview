export type ActiveLinkType = (typeof ActiveLinkTypes)[number];
export const ActiveLinkTypes = [
  "mylist",
  "series",
  "video",
  "live",
  "seiga",
  "solid",
  // user/*/mylist/* があり得るので user は最後
  "user",
] as const;
