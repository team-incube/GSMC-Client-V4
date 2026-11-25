"use client";

import { useScoreStatusStream } from "../model/useScoreStatusStream";

export function ScoreStatusSync() {
  useScoreStatusStream();
  return null;
}
