const Watchlist = require("../models/watchlist");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const watchlists = await Watchlist.find();
    res.render("indexWatchlist", { watchlists });
};

module.exports.renderNewForm = (req, res) => {
    res.render("newWatchlist");
};

module.exports.createWatchlist = async (req, res) => {
    const watchlist = new Watchlist(req.body.watchlist);
    watchlist.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    watchlist.author = req.user._id;
    await watchlist.save();
    console.log(watchlist);
    req.flash("success", "Successfully made a new watchlist!");
    res.redirect(`/watchlists/${watchlist._id}`);
};

module.exports.showWatchlist = async (req, res) => {
    const watchlist = await Watchlist.findById(req.params.id).populate("author");
    if (!watchlist) {
        req.flash("error", "Can not find that watchlist");
        return res.redirect("/watchlists");
    }
    res.render("showWatchlist", { watchlist });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const watchlist = await Watchlist.findById(req.params.id);
    if (!watchlist) {
        req.flash("error", "Can not find the requested watchlist");
        res.redirect("/watchlists/");
    }
    res.render("editWatchlist", { watchlist });
};

module.exports.updateWatchlist = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const watchlist = await Watchlist.findByIdAndUpdate(id, { ...req.body.watchlist });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    watchlist.images.push(...imgs);
    await watchlist.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await watchlist.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "Successfully updated watchlist");
    res.redirect(`/watchlists/${watchlist._id}`);
};

module.exports.deleteWatchlist = async (req, res) => {
    const { id } = req.params;
    const watchlist = await Watchlist.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the watchlist ");
    res.redirect("/watchlists");
};
