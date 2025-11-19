import indexHtml from "./index.html";

Bun.serve({
  port: 3000,
  routes: {
    "/": indexHtml,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("🚀 Books CLI running at http://localhost:3000");


