const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const cookieparser = require('cookie-parser');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const Blog = require('./models/blog');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT|| 8000;


app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(checkForAuthenticationCookie("token"));


app.use(express.static(path.resolve('./public')));

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(() => console.log("DB is connected"))
.catch((err) => console.log(err, "DB connection error"));



app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    if (!res.headersSent) {
        return res.status(500).send('Something went wrong!');
    }
    next(err);
});

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
