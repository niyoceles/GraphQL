const express = require('express');
const expressGrphQL = require('express-graphql');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');
const app = express();
const authors = [
  { id: 1, name: 'Celestin Niyonsaba' },
  { id: 2, name: 'Celes Niyonsaba' },
  { id: 3, name: 'Celest Niyonsaba' }
];

const books = [
  { id: 1, name: 'The Nothorious man', authorId: 1 },
  { id: 2, name: 'The Nothorious Woman', authorId: 2 },
  { id: 3, name: 'The Nothorious Child', authorId: 3 }
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represent a book written',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represent Author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    book: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
});


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'a single book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books
    },
    author: {
      type: AuthorType,
      description: 'a single authors',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of all authors',
      resolve: () => authors
    }
  })
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'add book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'add Author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name};
        authors.push(author);
        return author;
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});


app.use('/graphql', expressGrphQL({
  schema: schema,
  graphiql: true,
}),
);

app.listen(3000, () => console.log('Server running on 3000'));