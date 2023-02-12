const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle-[hash].js",
  },
  devServer: {
    open: true,
    port: 3000,
  },
  devtool: "source-map",
  plugins: [
    new CleanTerminalPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./src/favicon.png",
      template: "./src/index.html",
      filename: "index.html",
    }),
    new CleanWebpackPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  resolveLoader: {
    modules: [path.join(__dirname, "node_modules")],
  },
};
