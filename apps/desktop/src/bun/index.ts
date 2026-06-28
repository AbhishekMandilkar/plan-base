import { BrowserWindow, Updater } from "electrobun/bun";

import { bindMainWindow, planviewRpc } from "./rpc";

const DEV_SERVER_PORT = 3001;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

async function getMainViewUrl(): Promise<string> {
  const channel = await Updater.localInfo.channel();
  if (channel === "dev") {
    try {
      await fetch(DEV_SERVER_URL, { method: "HEAD" });
      console.log(`HMR enabled: Using web dev server at ${DEV_SERVER_URL}`);
      return DEV_SERVER_URL;
    } catch {
      console.log('Web dev server not running. Run "bun run dev:hmr" for HMR support.');
    }
  }

  return "views://mainview/index.html";
}

const url = await getMainViewUrl();

const mainWindow = new BrowserWindow({
  title: "Planbase",
  url,
  rpc: planviewRpc,
  titleBarStyle: "hiddenInset",
  trafficLightOffset: { x: 12, y: 14 }, // try different values
  frame: {
    width: 1100,
    height: 680,
    x: 120,
    y: 120,
  },
});

bindMainWindow(mainWindow);
mainWindow.setPageZoom(1);

console.log("Electrobun desktop shell started.");
