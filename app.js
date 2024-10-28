var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
const multer = require('multer')
var logger = require('morgan');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
require('dotenv').config();
var app = express();
app.listen(process.env.PORT || 2222, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(cors());
app.use(logger('dev'));
const upload = multer({ storage });
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'pug');
// Раздавать статические файлы из папки 'uploads'
app.use('/uploads', express.static('uploads'));

app.use('/api', require('./routes'));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
