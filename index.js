// dependencies
const http = require("http");
const https = require("https");
const { URL } = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");
const env = require("./config");
const router = require("./router");
const tokenisation = require("./lib/tokenisation");

//define server handler
const serverHandler = (origin) => (req, res) => {
  const stringDecoder = new StringDecoder("utf-8");
  let payloadBuffer = "";
  const parsedUrl = new URL(req.url, origin);

  req.on("data", (data) => {
    payloadBuffer += stringDecoder.write(data);
  });

  req.on("end", () => {
    payloadBuffer += stringDecoder.end();

    const chosenRequestHandler =
      typeof router[parsedUrl.pathname] === "function"
        ? router[parsedUrl.pathname]
        : router.notFound;

    const requestData = {
      method: req.method,
      path: parsedUrl.pathname,
      headers: req.headers,
      params: {},
      payload: null,
      authorisedUser: null,
    };

    try {
      requestData.payload = JSON.parse(payloadBuffer);
    } catch {}

    try {
      for (const [param, val] of parsedUrl.searchParams.entries()) {
        requestData.params[param] = val;
      }
    } catch {}

    requestData.token = req.headers.cookie?.split("=")[1] || "";

    tokenisation.deserializeUser(requestData.token, (err, user) => {
      if (!err && user) requestData.authorisedUser = user;

      chosenRequestHandler(requestData, (status = 200, data) => {
        const payload = typeof data === "object" ? data : {};

        if (payload.token) {
          res.setHeader("Set-Cookie", [`authorization=${payload.token}`]);
        }

        res.setHeader("Content-Type", "application/json");
        res.writeHead(status);
        res.end(JSON.stringify(payload));
      });
    });
  });
};

// define server and its configuration
const serverListensSuccessfullyCallback = (port) => () => {
  console.log(`Server in ${env.envName} mode listens on port ${port}.`);
};

try {
  const key = fs.readFileSync("./https/key.pem");
  const cert = fs.readFileSync("./https/cert.pem");
  const httpsOrigin = `https://localhost${env.PORT_HTTPS}`;
  https
    .createServer({ cert, key }, serverHandler(httpsOrigin))
    .listen(env.PORT_HTTPS, serverListensSuccessfullyCallback(env.PORT_HTTPS));
} catch {
  console.log("Something wrong with cert.pem or key.pem");
}

const httpOrigin = `http://localhost${env.PORT_HTTP}`;
http
  .createServer(serverHandler(httpOrigin))
  .listen(env.PORT_HTTP, serverListensSuccessfullyCallback(env.PORT_HTTP));
