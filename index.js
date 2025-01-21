const express = require("express")
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const morgan = require("morgan")
const bodyparser = require("body-parser")

const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users")
// the User.js is no need in this case.
const postRoute = require("./routes/posts")
const categoriesRoute = require("./routes/categories")

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Creating custom token
// with name time
morgan.token(
  "time",
  " :method request for :url was received.Response time: :response-time"
);

// Using the name of
// token we created above
app.use(morgan("time"));

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
console.log(`this is path ${path.join(__dirname, "/images")}`)
// app.use("/images", express.static( __dirname, "/images"));
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})
    .then(console.log("Connected to MongoDB"))
    .catch((reportError) => console.log(reportError));


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        // cb(null, req.body.name);
        cb(null, file.originalname);
    },
})

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"),
    (req,res) => {
    res.status(200).json(`File has been uploaded success with name ${req.body.name}` );
    })

//this will same route with /register ? on Postman, what URL is the corrected ?
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use ("/api/categories", categoriesRoute);

app.listen("5000", () => {
    console.log("Backend is running");
});
