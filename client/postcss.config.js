module.exports = {
  plugins: {
    "postcss-import-url": {},
    "postcss-import": {},
    "postcss-apply": {},
    "postcss-mixins": {},
    "postcss-cssnext": {
      features: {
        autoprefixer: {
          browsers: ["last 2 versions", "> 5%"]
        },
        calc: {
          preserve: true
        }
      }
    }
  }
};
