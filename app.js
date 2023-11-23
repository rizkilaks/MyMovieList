if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const watchlistRoutes = require("./routes/watchlists");
const reviewRoutes = require("./routes/reviews");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const watchlist = require("./models/watchlist");
const mongoSanitize = require("express-mongo-sanitize");

const MongoDBStore = require("connect-mongo");

//const dbUrl = process.env.DB_URL

const dbUrl = "mongodb://127.0.0.1:27017/mymovielist";

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("Connection Open!");
    })
    .catch((err) => {
        console.log("Error");
        console.log(err);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: "thisshouldbeabettersecret",
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("Session store error", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/watchlists", watchlistRoutes);
// app.use('/watchlists/:id/reviews', reviewRoutes)
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

// when routes to unknown address, e.g. watchlists/id/reviewId/method="_Delete", it will return to homepage.
app.all("*", async (req, res, next) => {
    const watchlists = await watchlist.find();
    res.render("indexwatchlist", { watchlists });
    //res.send('404 Not Found')
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = "Oh no, Something went wrong";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("Connecting to Port 3000");
});
