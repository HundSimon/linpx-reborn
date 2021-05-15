const chineseTrans = require('chinese-s2t');
export const { t2s }: { t2s: (text: string) => string } = chineseTrans;

export function getAppWidth() {
  return Math.min(448, document.documentElement.clientWidth);
}

const day = Math.ceil(new Date().getTime() / 1000 / 60 / 60 / 24 + 0.333333);
export function randomByDay(seed: number) {
  return ((seed * day + 49297) % 233280) / 233280;
}
