const express = require('express');
const Gene = require('../models/gene');
const display_router = express.Router();



display_router.get("/", async function (req, res) {
    try {
        const allDetails = await Gene.find({});

        // Key MUST match the variable name in EJS (genes)
        res.render("displayGenes", { genes: allDetails });
    } catch (err) {
        console.log(err);
        res.status(500).render("displayGenes", { genes: [] });
    }
});

module.exports = display_router;