const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebPack = require("webpack")

module.exports = {

    target: "web",
    mode: "development",
    devtool: 'source-map',

    entry: {
        app: "./src/hello.tsx",
        socketapp: "./src/mysocket.tsx",
        style: "./styles/style.scss"
    },

    output: {
        clean: true,
        path: path.resolve(__dirname, "../BlazorApp1/wwwroot"),
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
            template: path.resolve(__dirname, "layout", "index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: "./styles/style.scss",
        }),
        // I am not sure if this was needed to support the `devtool: 'source-map',` option above
        // new WebPack.LoaderOptionsPlugin({
        //     debug: true
        // })
    ],

    //This is config for the dev server
    // https://webpack.js.org/configuration/dev-server/#devserver
    devServer:{
        static: {
            directory: path.join(__dirname, 'public'),
          },

          compress: true,
          port: 9000,
          hot: false,

          headers: () => {
            return { 
                'X-Bar': ['key1=value1', 'key2=value2'] ,
                'x-mycustom': 'foobar'
            };
          },
    }
};