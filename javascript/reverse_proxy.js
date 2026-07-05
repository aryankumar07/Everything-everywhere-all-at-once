import http from "http";
import net from "net";
import { URL } from "url";

const PORT = process.env.PORT || 3001;

const domains = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "accounts.youtube.com",
  "youtu.be",
  "googlevideo.com",
  "ytimg.com",
  "youtubei.googleapis.com",
];

function isBlocked(hostname) {
  if (!hostname) return false;

  hostname = hostname.toLowerCase();

  return domains.some(domain => {
    domain = domain.toLowerCase();
    return hostname === domain || hostname.endsWith(`.${domain}`);
  });
}

const server = http.createServer((req, res) => {
  req.on("error", err => {
    console.log("HTTP req error:", err.code);
  });

  res.on("error", err => {
    console.log("HTTP res error:", err.code);
  });

  try {
    const targetUrl = new URL(req.url);
    const hostname = targetUrl.hostname;

    console.log("HTTP:", req.method, targetUrl.href);

    if (isBlocked(hostname)) {
      res.writeHead(403, {
        "Content-Type": "text/plain",
        "Connection": "close",
      });

      res.end(`Blocked by local proxy: ${hostname}`);
      return;
    }

    const proxyReq = http.request(
      {
        hostname,
        port: targetUrl.port || 80,
        method: req.method,
        path: targetUrl.pathname + targetUrl.search,
        headers: {
          ...req.headers,
          host: targetUrl.host,
        },
      },
      proxyRes => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", err => {
      console.log("proxyReq error:", err.code);

      if (!res.headersSent) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
          "Connection": "close",
        });
      }

      res.end("Proxy error: " + err.message);
    });

    req.pipe(proxyReq);
  } catch (err) {
    console.log("Bad HTTP request:", err.message);

    res.writeHead(400, {
      "Content-Type": "text/plain",
      "Connection": "close",
    });

    res.end("Bad request");
  }
});

server.on("connect", (req, clientSocket, head) => {
  const [hostnameRaw, portRaw] = req.url.split(":");

  const hostname = hostnameRaw?.toLowerCase();
  const port = Number(portRaw) || 443;

  console.log("HTTPS CONNECT:", hostname, port);

  clientSocket.on("error", err => {
    console.log("clientSocket error:", err.code);
  });

  clientSocket.on("timeout", () => {
    console.log("clientSocket timeout");
    clientSocket.destroy();
  });

  clientSocket.setTimeout(30_000);

  if (isBlocked(hostname)) {
    try {
      clientSocket.write(
        "HTTP/1.1 403 Forbidden\r\n" +
        "Connection: close\r\n" +
        "\r\n"
      );
    } catch (err) {
      console.log("Blocked socket write error:", err.code);
    }

    clientSocket.destroy();
    return;
  }

  const serverSocket = net.connect(port, hostname);

  serverSocket.on("error", err => {
    console.log("serverSocket error:", err.code);

    if (!clientSocket.destroyed) {
      clientSocket.destroy();
    }
  });

  serverSocket.on("timeout", () => {
    console.log("serverSocket timeout");
    serverSocket.destroy();
  });

  serverSocket.setTimeout(30_000);

  serverSocket.on("connect", () => {
    try {
      clientSocket.write(
        "HTTP/1.1 200 Connection Established\r\n" +
        "Connection: keep-alive\r\n" +
        "\r\n"
      );

      if (head && head.length > 0) {
        serverSocket.write(head);
      }

      clientSocket.pipe(serverSocket);
      serverSocket.pipe(clientSocket);
    } catch (err) {
      console.log("CONNECT setup error:", err.code);

      clientSocket.destroy();
      serverSocket.destroy();
    }
  });

  clientSocket.on("close", () => {
    if (!serverSocket.destroyed) {
      serverSocket.destroy();
    }
  });

  serverSocket.on("close", () => {
    if (!clientSocket.destroyed) {
      clientSocket.destroy();
    }
  });
});

server.on("clientError", (err, socket) => {
  console.log("server clientError:", err.code);

  if (socket && !socket.destroyed) {
    socket.destroy();
  }
});

server.on("error", err => {
  console.log("Proxy server error:", err.code);
});

server.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
