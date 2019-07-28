const   express = require('express');
const   bodyParser = require('body-parser');
const   graphqlHttp = require('express-graphql');
const   {buildSchema} = require('graphql');
// const   mongoose = require('mongoose');
const   Event = require('./models/event');




const   app = express();

        app.use(bodyParser.json());
        app.use('/graphql', new graphqlHttp({
            schema: buildSchema(`   
                type Event{
                    _id: ID!
                    title: String!
                    description: String!
                    price: Float!
                    date: String!
                }
                input EventInput{
                    title: String!
                    description: String!
                    price: Float!
                    date: String!
                }

                type RootQuery{
                    events: [Event!]!
                }
                type RootMutation{
                    createEvent(eventInput: EventInput): Event
                }
                
                schema{
                    query: RootQuery
                    mutation: RootMutation

                }
            `),
            rootValue: {
                events: () => {
                    return events;
                },
                createEvent: (args) => {
                    // const event = {
                    //     _id: Math.random().toString(),
                    //     title: args.eventInput.title,
                    //     description: args.eventInput.description,
                    //     price: +args.eventInput.price,
                    //     date: args.eventInput.date
                    //     // date: new Date().toISOString
                    // }
                    const event = new Event({
                        title: args.eventInput.title,
                        description: args.eventInput.description,
                        price: +args.eventInput.price,
                        date: new Date(args.eventInput.date)
                    })
                    return event.save()
                                .then(result => {
                                                    console.log(result);
                                                    return {...result._doc};
                                                })
                                .catch(error => {
                                                    console.log(error);
                                                    throw error;
                                                });
                }
            },
            graphiql: true
        }));

const   MongoClient = require('mongodb').MongoClient;
const   uri = "mongodb+srv://minhvuong123:r2sipQYPv6V9oKv8@cluster0-ahgsq.mongodb.net/test?retryWrites=true&w=majority";
const   client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("gql-event").collection("event");
            // perform actions on the collection object
            console.log(collection);
            
            client.close();
        });

        app.listen(4000, () => console.log("Server running on port 4000"));