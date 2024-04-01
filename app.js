const express = require("express");
const app = express();
const config = require("./config/config");


const mongoose = require("mongoose");
mongoose
  .connect(  "mongodb+srv://saurabhrajput9460:saurabh12345@managesystem.aiksq06.mongodb.net/manageSystem?retryWrites=true&w=majority&appName=manageSystem")
  .then((result) => {
    console.log("connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

   const fileUpload = require("express-fileupload");
app.use(fileUpload({ useTempFiles: true }));
   


const session = require("express-session");
app.use(session({ secret: config.sessionSecret }))

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//css
app.set("view engine", "ejs");
app.use(express.static("public"));
//user routes
const userRoutes = require("./routes/index");
app.use("/", userRoutes);
//admin routes
const admin = require('./routes/adminRoutes')
app.use('/admin',admin)


app.listen(3000, function () {
  console.log("serving is running on 3000");
});
