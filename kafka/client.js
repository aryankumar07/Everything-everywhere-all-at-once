import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
  clientId: 'kafka',
  brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"]
})

export default kafkaClient
