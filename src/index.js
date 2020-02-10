import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)  //greeting is taking data from client and paossing on to server
const users = [{
    'id': '1',
    'name': 'rahul',
    'email': '@@@@@',
    'age': 23
},
{
    'id': '2',
    'name': 'rhul',
    'email': '@@@@@',
    'age': 34
},
{
    'id': '3',
    'name': 'rul',
    'email': '@@@@@'
}]

const posts = [{
    'id': '1',
    'title': 'rahul',
    'body': 'i got things i wanna do to you',
    'published': true,
    'author': "1"
},
{
    'id': '2',
    'title': 'rhul',
    'body': 'make me make me ',
    'published': false,
    'author': '2'
},
{
    'id': '3',
    'title': 'rul',
    'body': 'you lke my hair',
    "published": true,
    'author': '1'
}]
const comments = [{
    'id': "101",
    'text': "testingweirs",
    'author': '1'
},
{
    'id': '092',
    'text': 'this is a test for comment 2',
    'author': '2'
},
{
    'id': '387',
    'text': 'comment 3 test',
    'author': '1'
}]

//Object are defined here
const typeDefs = `
    type Query {
        greeting(name: String, postion: String!): String!  
        add(numbers:[Float!]): Float!
        grades : [Int!]!
        users(query: String): [User!]
        me: User!
        posts(query: String): [Post!]
        post: Post! 
        comments: [Comment!]
    }

    type Comment{
        id: ID!
        text: String!
        author: User!
    }

    type Post{
        id: ID!
        title : String!
        body: String!
        published : Boolean!
        author: User
    }

    type User {
        id: ID!,
        name: String!
        email: String
        age: Int
        posts: [Post!]
        comments:[Comment!]
    }
`

// Resolvers:  root property is defined here, Query, 
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if (arg.name && arg.postion) { return `hello, ${arg.name}! you are my fav, ${arg.postion}` }
            else { return "hello!" }
        },
        add(parent, args, ctx, info) {
            if (args.numbers.length == 0) {
                return 0
            }

            return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator + currentValue

            })
        },
        //array of scalar type, no need to speicdfy a custom set so query { grades} will work 
        grades(parent, args, ctx, info) {
            return [99, 78, 54]

        },
        comments(parent, args, ctx, info) {
            return comments

        },
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })

        },

        me() {
            return {
                id: "2122",
                name: 'mike',
                email: 'sddd@fdfdsf'
            }
        },

        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch

            })

        },


    },
    Post: {  //method for field that link to another type
        author(parent, args, ctx, info) {  //post object is the parent argument
            return users.find((user) => { // parent is the number of post 1,2,3 //find matches individual array item
                return user.id === parent.author
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return parent.author === user.id

            })
        }

    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id

            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id

            })
        }
    }

}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})