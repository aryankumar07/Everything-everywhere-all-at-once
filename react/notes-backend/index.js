import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typedefs } from "./typedef.js";
import { resolvers } from "./resolver.js";


const server = new ApolloServer({
  typeDefs: typedefs,
  resolvers
})


const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000
  }
})


console.log(`server started at port ${4000} , at url : ${url}`)
