import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prismaClient from "./prisma";

const kafka = new Kafka({
  brokers: ["kafka-1ea0bb33-azimcool06-d4f4.a.aivencloud.com:14461"],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_EbqhgNjDy7QskWgMjmr",
    mechanism: "plain",
  },
});
let producer: null | Producer = null;
export async function createProducer() {
  if (producer) {
    return producer;
  } else {
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
  }
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });

  return true;
}

export async function startMessageConsumer() {
    console.log('consumer is running')
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES",fromBeginning: true});
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      console.log("new message recived");
      try {
        await prismaClient.message.create({
          data: {
            text: message.value?.toString(),
          },
        });
      } catch (err) {
        console.log("something went wrong");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 100);
      }
    },
  });

  return true;
}

export default kafka;
