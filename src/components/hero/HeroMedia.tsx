"use client";

import { HeroVideo } from "./HeroVideo";

type Props = {
  hasVideo: boolean;
  poster?: string;
};

export function HeroMedia({ hasVideo, poster }: Props) {
  if (!hasVideo) return null;
  return <HeroVideo poster={poster} />;
}
