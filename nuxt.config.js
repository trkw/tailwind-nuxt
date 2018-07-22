const PurgecssPlugin = require("purgecss-webpack-plugin")
const glob = require("glob-all")
const path = require("path")

class TailwindExtractor {
  static extract(content) {
    // eslint-disable-next-line
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "fullstack",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
  ** Load global CSS
  */
  css: ["@/assets/css/main.css"],
  router: {
    base: "",
    linkActiveClass: "is-active"
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
      /*
      ** Cleanup CSS with PurgeCSS
      */
      if (!isDev) {
        config.plugins.push(
          new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, "./pages/**/*.vue"),
              path.join(__dirname, "./layouts/**/*.vue"),
              path.join(__dirname, "./components/**/*.vue")
            ]),
            extractors: [
              {
                extractor: TailwindExtractor,
                extensions: ["vue"]
              }
            ],
            whitelist: ["html", "body"]
          })
        )
      }
    }
  }
}
