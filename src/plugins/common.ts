import { Store } from "../components/toast/store";
import { ref } from "vue";
export const { setMsg } = Store();
export const isLarge = ref(false);
export const formatTime = (value: number, details = false) => {
  let date = new Date(value * 1000);
  let y: string = date.getFullYear().toString(),
    m: any = date.getMonth() + 1,
    d: any = date.getDate();
  let h, min;
  if (details) {
    h = date.getHours();
    min = date.getMinutes();
    if (h < 10) {
      h = "0" + h;
    }
    if (min < 10) {
      min = "0" + min;
    }
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  y = y.substring(y.length - 2);
  let str = y + "-" + m + "-" + d + " ";
  return details ? str + h + ":" + min : str;
};

export function loadTheme() {
  const theme = localStorage.getItem("theme") || "halloween";
  document.documentElement.setAttribute("data-theme", theme);
}
export function SetTheme(name: string) {
  localStorage.setItem("theme", name);
  document.documentElement.setAttribute("data-theme", name);
}
export function getTheme() {
  return localStorage.getItem("theme");
}
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isNight =
  new Date().getHours() >= 22 || new Date().getHours() <= 6;
