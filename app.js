const path = require("path");
const express = require("express");
const app = express();

const adminRoute = require("./routes/admin");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoute);

app.listen(3000);