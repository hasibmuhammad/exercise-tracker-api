const express = require('express')
const app = express()
const cors = require('cors')
const DBConnection = require('./utils/DBConnection')
const UserModel = require('./models/User')
const ExerciseModel = require('./models/Exercise')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// @POST - Create USER
app.post("/api/users", async (req, res) => {
  
  // DB connection
  await DBConnection();
  
  const {username} = await req.body;

  const userExist = await UserModel.findOne({username})

  if(!userExist) {
    const result = await UserModel.create({username})

    if(result) {
      res.status(200).json({_id: result._id, username})
    } else {
      res.status(400).json({message: "Something went wrong creating user!"})
    }

  } else {
    res.json({message: "User already exists!"});
  }
});

app.get("/api/users", async (req, res) => {
  await DBConnection();
  const users = await UserModel.find({}).select({__v: 0});
  res.send(users);
})

app.post("/api/users/:_id/exercises", async (req, res) => {
  await DBConnection();
  const _id = req.params._id;
  const user = await UserModel.findById({_id});
  const {description, duration, date} = req.body;

  // console.log({user_id: user._id, username: user.username, description, duration, date: modifiedDate});

  if(!user) {
    res.json({message: "Couldn't find the user!"});
  } else {
    const result = await ExerciseModel.create({user_id: user._id, description, duration, date: date ? new Date(date) : new Date()});

    if(result) {
      res.json({_id: user._id, username: user.username, duration: result.duration, description: result.description, date: result.date.toDateString()});
    } else {
      res.send({message: "Error creating exercise!"});
    }
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const {from, to, limit} = req.query;
  const id = req.params._id;
  await DBConnection();

  const user = await UserModel.findById({_id: id});

  if(!user) {
    return res.json({message: "User not found"});
  } else {

    let dateObj = {};
    if(from) {
      dateObj["$gte"] = new Date(from);
    }
    if(to) {
      dateObj['$lte'] = new Date(to);
    }

    let filter = {user_id: id}
    if(from || to) {
      filter.date = dateObj;
    }
    const exercises = await ExerciseModel.find(filter).limit(+limit ?? 100);

    const logs = exercises.map(u => ({
      description: u.description,
      duration: u.duration,
      date: u.date.toDateString()
    }));

    if(!exercises) {
      return res.json({message: "Exercises not found!"});
    } else {
      res.json({
        _id: id,
        username: user.username,
        count: exercises.length,
        log: logs
      })
    }
  }
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
