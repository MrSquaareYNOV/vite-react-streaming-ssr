import http from "http";
import ReactDOMServer from "react-dom/server";
import App from "../App";

type RenderOptions = {
  startHtml: string;
  endHtml: string;
}

export const render = (res: http.ServerResponse, options: RenderOptions) => {
  const { pipe } = ReactDOMServer.renderToPipeableStream(
    <App />,
    {
      onShellReady: () => {
        res.setHeader("Content-Type", "text/html");
        res.write(options.startHtml);
        pipe(res);
      },
      onShellError: (error: any) => {
        res.setHeader("Content-Type", "text/json");
        res.end(JSON.stringify({ error }));
      },
      onAllReady: () => {
        res.end(options.endHtml);
      }
    }
  )
}
