### What is Huddle?
Huddle is an NFL Web Scraper. It scrapes the NFL website and presents a view of the data that is easier to use than the NFL website.

### Technical Details

Huddle is built using node and React.

Huddle is composed of two elements:
* server
  * express
  * Located in: src/server
* client
  * react
  * Located in: src/client

### Compiling and Startin the Webserver

To start the web server:
```sh
  $ npm run start:server
```

To compile the server source (./src/server) into (./dist/server):
```sh
  $ npm run compile:server
```

To compile the client (./src/client) into (./public/js/client/huddle.react.js):
```sh
  $ npm run compile:client
```
Webpack configuration is stored in ./webpack.config.js

