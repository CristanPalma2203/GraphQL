const { ApolloServer, gql } = require('apollo-server');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = gql`
  input CreateTaskInput {
    assigneeId: String
    dueDate: DateTime!
    name: String!
    pointEstimate: PointEstimate!
    status: Status!
    tags: [TaskTag!]!
  }
  

  scalar DateTime

  input DeleteTaskInput {
    id: String!
  }

  input FilterTaskInput {
    assigneeId: String
    dueDate: DateTime
    name: String
    ownerId: String
    pointEstimate: PointEstimate
    status: Status
    tags: [TaskTag!]
  }

  input CreateUserInput {
    avatar: String
    email: String!
    fullName: String!
    type: UserType!
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    deleteTask(input: DeleteTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task!
    createUser(input: CreateUserInput!): User!
  }

  enum PointEstimate {
    EIGHT
    FOUR
    ONE
    TWO
    ZERO
  }

  type Query {
    profile: User!
    tasks(input: FilterTaskInput!): [Task!]!
    users: [User!]!
    getAllUsers: [User!]!
  } 

  type Query {
    profile: User!
    tasks(input: FilterTaskInput!): [Task!]!
    users: [User!]!
  }

  enum Status {
    BACKLOG
    CANCELLED
    DONE
    IN_PROGRESS
    TODO
  }

  type Task {
    assignee: User
    createdAt: DateTime!
    creator: User!
    dueDate: DateTime!
    id: ID!
    name: String!
    pointEstimate: PointEstimate!
    position: Float
    status: Status!
    tags: [TaskTag!]!
  }

  enum TaskTag {
    ANDROID
    IOS
    NODE_JS
    RAILS
    REACT
  }

  input UpdateTaskInput {
    assigneeId: String
    dueDate: DateTime
    id: String!
    name: String
    pointEstimate: PointEstimate
    position: Float
    status: Status
    tags: [TaskTag!]
  }

  type User {
    avatar: String
    createdAt: DateTime!
    email: String!
    fullName: String!
    id: ID!
    type: UserType!
    updatedAt: DateTime!
  }

  enum UserType {
    ADMIN
    CANDIDATE
  }
`;
const users = [
  {
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'cristianpalma1703@gmail.com',
    fullName: 'Cristian Palma',
    type: 'CANDIDATE',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIJWecMqpAgdnX20SEFoJ-7Xw0szgYCmkkDTfJBjts3NQ=s288-c-no',
  },
  {
    id: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'david@gmail.com',
    fullName: 'David Patricio',
    type: 'ADMIN',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  
];

const tasks = [
  {
    id: 1,
    createdAt: "2023-11-22T10:16:13.697Z",
    creator: {
      id: '1',
      createdAt: "2023-11-22T10:15:53.068Z",
      updatedAt: "2023-11-22T10:15:53.068Z",
      email: 'cristianpalma1703@gmail.com',
      fullName: 'Cristian Palma',
      type: 'CANDIDATE',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIJWecMqpAgdnX20SEFoJ-7Xw0szgYCmkkDTfJBjts3NQ=s288-c-no'
    },
    assignee: {
      id: '1',
      createdAt: "2023-11-22T10:15:53.068Z",
      updatedAt: "2023-11-22T10:15:53.068Z",
      email: 'cristianpalma1703@gmail.com',
      fullName: 'Cristian Palma',
      type: 'CANDIDATE',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIJWecMqpAgdnX20SEFoJ-7Xw0szgYCmkkDTfJBjts3NQ=s288-c-no'
    },
    assigneeId: '1',
    dueDate: '2023-11-22T10:16:07.000Z',
    name: 'test',
    pointEstimate: 'ONE',
    status: 'BACKLOG',
    tags: [ 'REACT', 'NODE_JS' ]
  },
  {
    id: 2,
    createdAt: "2023-11-22T10:18:45.048Z",
    creator: {
      id: '1',
      createdAt: "2023-11-22T10:15:53.068Z",
      updatedAt: "2023-11-22T10:15:53.068Z",
      email: 'cristianpalma1703@gmail.com',
      fullName: 'Cristian Palma',
      type: 'CANDIDATE',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIJWecMqpAgdnX20SEFoJ-7Xw0szgYCmkkDTfJBjts3NQ=s288-c-no'
    },
    assignee: {
      id: '1',
      createdAt: "2023-11-22T10:15:53.068Z",
      updatedAt: "2023-11-22T10:15:53.068Z",
      email: 'cristianpalma1703@gmail.com',
      fullName: 'Cristian Palma',
      type: 'CANDIDATE',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIJWecMqpAgdnX20SEFoJ-7Xw0szgYCmkkDTfJBjts3NQ=s288-c-no'
    },
    assigneeId: '1',
    dueDate: '2023-11-30T10:18:39.000Z',
    name: 'test',
    pointEstimate: 'TWO',
    status: 'BACKLOG',
    tags: [ 'IOS', 'NODE_JS', 'ANDROID' ]
  },
];

const resolvers = {
  Query: {
    users: () => {
      return users;
    },
    tasks: () => {
      return tasks;
    },
  },
  Mutation: {
    createUser: (_, { input }) => {
      
      const newUser = {
        id: users.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...input,
      };
      users.push(newUser); 
      return newUser;
    },
    createTask: (_, { input }) => {
      console.log("input",input);
      let taskIndex = -1;

      for (let i = 0; i < users.length; i++) {
        if (users[i].id == input.assigneeId) {
          taskIndex = i;
          break;
        }
      }

      const newTask = {
        id: tasks.length + 1,
        createdAt: new Date(),
        creator: users[0], 
        assignee: users[taskIndex],
        ...input,
        
      };
      console.log("newTask",newTask); 
      tasks.push(newTask);
      return newTask;
    },
    updateTask: (_, { input }) => {
      let taskIndex = -1;

      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == input.id) {
          taskIndex = i;
          break;
        }
      }
      
      if (taskIndex === -1) {
        throw new Error('Task not found test');
      }


      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...input,
      };

      return tasks[taskIndex];
    },
    deleteTask:(_, { input }) => {
      let taskIndex = -1;

      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == input.id) {
          taskIndex = i;
          break;
        }
      }

      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      return task;
    }
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({ schema });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});