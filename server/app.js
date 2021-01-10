const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://asher0903:asher0903@cluster0.lcse8.mongodb.net/test',{
          useNewUrlParser: true, 
          useUnifiedTopology: true, 
          userFindAndModify: false,
          useCreateIndex: true, 
          dbName: 'test'
        });

mongoose.connection.once('open', () => {
  console.log("connected to database");
});

app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: true ,
}));

app.listen(4000, () => {
  console.log("...listening for requests on port 4000...");
});