const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebPack = require("webpack")

module.exports = {

    target: "web",
    mode: "development",
    devtool: 'source-map',

    entry: {
        app: "./app/clientApp.tsx",
        style: "./styles/style.scss"
    },

    output: {
        clean: true,
        path: path.resolve(__dirname, "../AzIsdDapr/AzIsdDapr.ClientApi/wwwroot/"),
        filename: '[name]'.js
    },

    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx", ".css", ".scss"],
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
            //   {
            //     test: /\.css$/,
            //     loader: "css-loader",
            //   },
            {
                test: /\.scss$/,
                rules: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "layouts/client", "index.html"),
        })
        ,
        new MiniCssExtractPlugin({
            filename: "./styles/style.scss",

        })
    ],
};