var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

const models = require("./models/index");

const cors = require("cors");
const logger = require("morgan");
const compression = require("compression");

const indexRouter = require("./router");
const wechatRouter = require("./wechat");

const app = express();
const config = require("./config");
app.use(compression());
app.use(cors(config.cors));
app.set("trust proxy", 2); // trust first proxy

app.use(logger("tiny"));
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: 864000, // one day
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 小程序不支持session
// const session = require("express-session");
// const key = "lbs-mini";
// app.use(cookieParser(key));
// app.use(
//   session({
//     secret: key, //与cookieParser中的一致
//     resave: true,
//     saveUninitialized: true,
//   })
// );

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    console.log();
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("images"), (req, res) => {
  console.log("req body", req.body);
  console.log("req file", req.file);
  // if (req.file.fieldname) {
  //   res.status(200).json({ success: true, data: req.file.filename });
  // } else {
  //   res.json({ success: false });
  // }
  res.json({
    success: true,
    data: [{ url: `${config.bind}/images/${req.file.filename}` }],
  });
});

app.use("/", indexRouter);
app.use("/wechat", wechatRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.json(err);
});

module.exports = app;
