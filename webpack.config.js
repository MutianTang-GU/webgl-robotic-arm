module.exports = {
  module: {
    rules: [
      {
        test: /\.vert$/i,
        use: "raw-loader",
      },
      {
        test: /\.frag$/i,
        use: "raw-loader",
      },
    ],
  },
};
