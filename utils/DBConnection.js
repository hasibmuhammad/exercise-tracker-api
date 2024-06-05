const mongoose = require('mongoose')

const DBConnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        if (connection.connections[0].readyState) {
            console.log("DB connected successfully!")
        } else {
            console.log("DB connection failed!")
        }
    } catch(error) {
        console.error(error)
    }
}

module.exports = DBConnection;