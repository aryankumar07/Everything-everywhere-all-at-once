import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { connectDb } from './db/index.js'
import { typeDefs } from './scehma.js'
import { resolver } from './resolvers/generals.js'


const startApp = async () => {
  try {
    await connectDb()
    console.log("Connecting to Server")

    const server = new ApolloServer({
      typeDefs,
      resolvers: resolver
    })

    const { url } = await startStandaloneServer(server, {
      listen: 4000
    })

    console.log("server started at : ", url)

  } catch (err) {
    console.log("unable to connect to database", err)
  }
}


startApp()
