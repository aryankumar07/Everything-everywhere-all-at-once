import kafkaClient from "./client.js";
import readline from 'readline'


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


async function init() {
  const producers = kafkaClient.producer()
  await producers.connect()
  rl.setPrompt(" > ")
  rl.prompt()

  rl.on("line", async (line) => {
    const [driver, location] = line.split(" ")
    await producers.send({
      topic: "riders",
      messages: [
        {
          partition: 0,
          key: "location-update",
          value: JSON.stringify({
            name: driver,
            location
          })
        }
      ]
    })
  }).on("close", () => {
    console.log("cline closed")
  })
}

init()
