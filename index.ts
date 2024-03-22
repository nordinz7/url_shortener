import { nanoid } from "nanoid";
import appConfig from "./app.config";
import { DbSingleton } from "./utils/db";


Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(Bun.file("./public/index.html"));
    }


    if (req.method === 'GET' && url.pathname === "/submit") {
      const long_url = url.searchParams.get('url');
      const short_url = nanoid(6)

      const db = await DbSingleton.getInstance();

      await db.set(short_url, long_url);

      return Response.json({ key: short_url, long_url, short_url: `${appConfig.Port}/${short_url}` });
    }

    if (req.method === 'GET' && url.pathname === "/redirect") {
      const key = url.searchParams.get('s');

      const db = await DbSingleton.getInstance();

      const long_url = await db.get(key);

      if (long_url) {
        return Response.redirect(long_url, 301);
      }

      return new Response("key not found", { status: 404 });
    }

    return new Response("404!");
  },

  port: appConfig.Port,
  development: appConfig.Env === "development",
});


console.log(`--------server is running on ${appConfig.Port}`)