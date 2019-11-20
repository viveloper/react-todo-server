const express = require('express');
const morgan = require('morgan');
const bearerTokenParser = require('express-bearer-token');
const verifyToken = require('./modules/verifyToken');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(bearerTokenParser());

const secretKey = process.env.SECRET_KEY;
app.use((req, res, next) => {
    req.config = {
        secretKey: secretKey
    }
    return next();
});

app.use('/api', verifyToken);

// router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const todoRouter = require('./routes/api/todo');
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api/todo', todoRouter);

// connect mongodb
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MonogDB connection established successfully!');
});

// run server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`port : ${port}`);
});