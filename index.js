const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require("./graphql/typeDefs.js")

const { MONGODB } = require('./config.js');

const Post = require('./modules/Post');

const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers
});


const database = "mongodb+srv://dbUser:arduino1607@cluster0.pezobry.mongodb.net/merng?retryWrites=true&w=majority";
mongoose
    .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log("e don connect")
        return server.listen({ port: 5000 })
    })
    .catch((err) => console.log(err));