import fs from "fs";
import http from "http";
import serve from "serve-static";
import { Connect, ViteDevServer } from 'vite';

type VitePreviewServer = {
  middlewares: Connect.Server;
  httpServer: http.Server;
}

const devIndexPath = "./index.html";
const devServerRenderPath = "./src/server/render.tsx";
const previewIndexPath = "./dist/index.html";
const previewServerRenderPath = "./dist/server/render.js";

export const devMiddleware = (server: ViteDevServer) => {
  server.middlewares.use(async (req, res, next) => {
    if (req.url !== "/") {
      return next();
    }

    const url = req.originalUrl;
    const html = fs.readFileSync(devIndexPath, "utf-8");
    const transformedHtml = await server.transformIndexHtml(url, html);
    const { render } = await server.ssrLoadModule(devServerRenderPath);
    const [startHtml, endHtml] = transformedHtml.split("<!-- app -->");

    render(res, {
      startHtml,
      endHtml,
    });
  });
}

export const previewMiddleware = (server: VitePreviewServer) => {
  server.middlewares.use(async (req, res, next) => {
    if (req.url !== "/") {
      return next();
    }

    const transformedHtml = fs.readFileSync(previewIndexPath, "utf-8");
    const { render } = await import(previewServerRenderPath);
    const [startHtml, endHtml] = transformedHtml.split("<!-- app -->");

    render(res, {
      startHtml,
      endHtml,
    });
  });
}
