import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk";
import { Tag } from "./tag";

export type Article = {
  title?: string;
  thumbnail?: MicroCMSImage;
  preview?: string;
  text?: string;
  tag: (MicroCMSListContent & Tag) | null;
};