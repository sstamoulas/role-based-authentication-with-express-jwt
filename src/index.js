import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'

import { seed } from './seed.js'
import authRoutes from './routes/auth.route'
import productRoutes from './routes/product.route'

const app = express()
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
})
.then(() => {
  console.log('Connected to the Database successfully')
  
  if(process.env.NODE_ENV == 'development') {
    seed()
  }
})
.catch((error) => console.log(`Error: ${error}`))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(cors())

app.use('/', authRoutes)
app.use('/', productRoutes)

app.listen(PORT, () => console.log('Server is listening on Port:', PORT))
