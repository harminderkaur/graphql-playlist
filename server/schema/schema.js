const graphql = require('graphql');
const Book = require('../modals/book');
const Author = require('../modals/author');

const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;



const BookType = new GraphQLObjectType({
  name:'Book',
  fields: () => ({
    id: {type: GraphQLID },
    name: {type: GraphQLString },
    genre: {type: GraphQLString },
    author:{
      type:AutorsType,
      resolve(parent, args){
        // return _.find(authors,{id: parent.authorId});
        return Author.findById(parent.authorId)
      }
    }
  })
});

const AutorsType = new GraphQLObjectType ({
  name:"Author",
  fields: () => ({
    id:{type: GraphQLID},
    name:{type:GraphQLString},
    age:{type:GraphQLString},
    books:{
      type:new GraphQLList (BookType),
      resolve(parent, args){
       // return _.filter(books, {authorId:parent.id});
       return Book.find({
         authorId:parent.id
       })
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      book: {
          type: BookType,
          args: { id: { type: GraphQLID } },
          resolve(parent, args){
              // code to get data from db / other source
              console.log(typeof(args.id));
             //  return _.find(books, { id: args.id });
             return Book.findById(args.id)
          }
      },
      author: {
        type: AutorsType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args){
            // code to get data from db / other source
            console.log(typeof(args.id));
            // return _.find(authors, { id: args.id });
            return Author.findById(args.id)
        }
    }, 
      books:{
        type: new GraphQLList(BookType),
        resolve(parent, args){
          return Book.find({});
        }
    },
      authors:{
        type: new GraphQLList(AutorsType),
        resolve(parents, args){
          return Author.find({});
        }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addAuthor:{
      type:AutorsType,
      args:{
        name:{type: new GraphQLNonNull( GraphQLString)},
        age:{type:new GraphQLNonNull (GraphQLInt)}
      },
      resolve(parent,args){
        let author = new Author({
          name:args.name,
          age:args.age
        });
        return author.save();
      }
    },
    addBook:{
      type:BookType,
      args:{
        name:{type: new GraphQLNonNull (GraphQLString)},
        genre:{type:new GraphQLNonNull (GraphQLString)},
        authorId:{type: new GraphQLNonNull (GraphQLID)}
      },
      resolve(parent,args){
        let book = new Book({
          name:args.name,
          genre:args.genre
        });
        return book.save();
      }
    }
  }
});

module.exports = new GraphQLSchema ({
  query:RootQuery,
  mutation:Mutation
});