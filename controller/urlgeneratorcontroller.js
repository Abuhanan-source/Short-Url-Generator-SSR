import mongoose from "mongoose";
import shortid from "shortid";
import URLmodel from "../schema/UrlSchema.js";

export const ShortUrlgenerator = async (req, res) => {
    try {
        const body = req.body;
        const shortUrl = shortid();
        const requrl = req.protocol + "://" + req.get("host") + "/url/" + shortUrl;

        const storeUrl = await URLmodel.create({
            shortUrlId: shortUrl,
            RedirectUrl: body.url,
            createdBy: req.user._id,
            urlClickHistory: [],
        })

        res.status(201).render("Homepage", { shortUrl: requrl });
    } catch (error) {
        res.status(500).json({
            message: "Error generating short URL",
            error: error.message
        });
    }

};


export const RedirectUrl = async (req, res) => {
    try {
        const shortUrlId = req.params;
        const urlfindAndUpdate = await URLmodel.findOneAndUpdate(shortUrlId, {
            $push : {
                urlClickHistory:{
                    timestamps: Date.now()
            }}
        });

        if (!urlfindAndUpdate) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.redirect(urlfindAndUpdate.RedirectUrl);
    } catch (error) {
        res.status(500).json({
            message: "Error redirecting to URL Failed!",
            error: error.message
        });
    }

}



export const GetUrlClickHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const ClickHistory = await URLmodel.find({ createdBy: userId });

        if(!ClickHistory){
            return res.status(400).json({
                message: "No URL found click history found for this user"
            });
        }

        // const urlClickCount = ClickHistory.urlClickHistory.length
        let urlClickTimestamps = []
        ClickHistory.forEach(url => {
            urlClickTimestamps.push({
                totalClick: url.urlClickHistory.length,
                timestamps: url.urlClickHistory.map(history => new Date(history.timestamps).toLocaleString()),
                shortUrl: req.protocol + "://" + req.get("host") + "/url/" + url.shortUrlId,
            });
        });

        return res.status(200).render("Homepage", { urlClickTimestamps: urlClickTimestamps });

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving URL click history",
            error: error.message
        });
    }
}


