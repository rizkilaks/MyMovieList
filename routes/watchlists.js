const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Watchlist = require("../models/watchlist");
const expressError = require("../utils/expressError");
const { isLoggedIn, isAuthor, validateWatchlist } = require("../middleware");
const watchlists = require("../controllers/watchlists");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/")
    .get(isLoggedIn, catchAsync(watchlists.index))
    .post(isLoggedIn, upload.array("image"), validateWatchlist, catchAsync(watchlists.createWatchlist));

router.get("/new", isLoggedIn, watchlists.renderNewForm);

router
    .route("/:id")
    .get(isLoggedIn, catchAsync(watchlists.showWatchlist))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateWatchlist, catchAsync(watchlists.updateWatchlist))
    .delete(isLoggedIn, isAuthor, catchAsync(watchlists.deleteWatchlist));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(watchlists.renderEditForm));

module.exports = router;
