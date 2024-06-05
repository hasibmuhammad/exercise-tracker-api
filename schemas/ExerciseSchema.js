const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
    user_id: String,
    description: String,
    duration: Number,
    date: Date
})

module.exports = ExerciseSchema;