const mongoose = require('mongoose')
const ExerciseSchema = require('../schemas/ExerciseSchema')

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

module.exports = ExerciseModel;