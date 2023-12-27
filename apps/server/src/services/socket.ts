import Redis from "ioredis";
import { Server } from "socket.io";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: "redis-34c7486f-azimcool06-d4f4.a.aivencloud.com",
  port: 14448,
  username: "default",
  password: "AVNS_Y2-hq77-Ya5c5pIbeQi",
});
const sub = new Redis({
  host: "redis-34c7486f-azimcool06-d4f4.a.aivencloud.com",
  port: 14448,
  username: "default",
  password: "AVNS_Y2-hq77-Ya5c5pIbeQi",
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("init socket sever...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    sub.subscribe("MESSAGES");
  }

  public initListener() {
    const io = this._io;
    console.log("init socket listener...");
    io.on("connection", (socket) => {
      console.log("New Socket Connected ", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message", message);
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });
    sub.on("message", async (channel, message) => {
      console.log("channel", channel);
      if (channel === "MESSAGES") {
        io.emit("message", message);
        await produceMessage(message)
        console.log('message produce to kafka broker')
       
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
