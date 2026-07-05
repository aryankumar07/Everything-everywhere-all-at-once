import kafkaClient from "./client.js";

async function init() {
  const admin = kafkaClient.admin()

  try {
    await admin.connect()
    console.log("admin connected")

    await admin.createTopics({
      topics: [
        {
          topic: 'riders',
          numPartitions: 2
        }
      ]
    })
    console.log("created Topics")
  } finally {
    await admin.disconnect()
    console.log("disconnect admin")
  }
}

init().catch((error) => {
  console.error("admin failed", error)
  process.exitCode = 1
})
