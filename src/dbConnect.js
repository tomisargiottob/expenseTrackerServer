import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

if (process.env.DATABASE_ENV === 'develop') {
  mongoose.connect(
    `${process.env.DB_DEVELOP_URI}`, {
      dbName: 'spending'
    }
  );
} else {
  mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gifny.mongodb.net/spending`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
}


const connection = mongoose.connection

connection.on('connected' , () => console.log('Mongo DB Connection Successfull'))