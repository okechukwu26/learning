const express = require('express');
const keys = require('./config/keys');
const cor = require('cors');
const app = express();
const userRouter = require('./Routes/user');
const mongoose = require('mongoose');

app.use(cor());
app.use(express.json());

const port = process.env.PORT || 3000;
app.use('/api', userRouter);

mongoose
  .connect('mongodb://127.0.0.1:27017/learning', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`server is up on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
