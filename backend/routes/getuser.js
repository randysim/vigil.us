const Express = require("express");
const Router = Express.Router();

const DataManager = require("../modules/DataManager.js");

Router.post("/", async (req, res) => {
    let requestIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    let token = req.body.token;

    if (!token) return res.send({ success: false, error: "Missing Token" });

    let data = await DataManager.GetUserData(token);
    if (!data) return res.send({ success: false, error: "Invalid Token" });

    let suspectData = [];
    for (suspectId of data.suspects) {
        let susD = await DataManager.GetSuspectData(suspectId);
        suspectData.push(susD);
    }

    res.send({ success: true, token: token, creationDate: data.creationDate, suspects: suspectData });
});

module.exports = {
    path: "getuser",
    router: Router
}