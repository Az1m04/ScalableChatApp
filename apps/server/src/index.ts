import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";

async function init() {
  startMessageConsumer()
  const socketService = new SocketService();
  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8200;
  socketService.io.attach(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
  socketService.initListener()
}

init();
