import mongoose from 'mongoose'

const db_connection = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URL_LOCAL)
    .then(() => console.log('Database is Connected'))
    .catch(err => console.log('Database Not Connected', err))
}

export default db_connection
