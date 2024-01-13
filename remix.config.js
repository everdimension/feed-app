/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverDependenciesToBundle: ["structure-kit"],
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverModuleFormat: "esm",
};
