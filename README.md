### What is Huddle?
Huddle is an NFL Web Scraper. It scrapes the NFL website and presents a view of the data that is easier to use than the NFL website.

### Technical Details

Huddle is built using node and React.

### Compiling and Startin the Webserver

To start the web server:
```sh
  $ npm run-script startserver
```

To compile the server source (./src/server) into (./dist/server):
```sh
  $ npm run-script compileserver
```

To compile the client (./src/client) into (./public/js/client/huddle.react.js):
```sh
  $ npm run-script compileclient
```
Webpack configuration is stored in ./webpack.config.js

