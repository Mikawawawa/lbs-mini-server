var config = {
  dialect: "mysql",
  database: "lbs_mini",
  username: "root",
  password: "Ssq03230202",
  host: "129.204.218.96:3306",
  port: 3306,
  http: 8080,
  cors: {
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
    origin: [
      // "http://192.168.0.103:3000",
      "http://jianyangfan.cn",
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:8080/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:3000/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:5000/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:5001/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:5002/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:4000/,
      "localhost:8080",
    ],
  },
  redisTick: 10,
  AppId: "wxdc1a92bb01bfd8bb",
  AppSecret: "e685d81fadcf3600be650159cf89316f",
};

module.exports = config;
