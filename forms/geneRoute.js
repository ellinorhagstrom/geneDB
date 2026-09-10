const express = require('express');
const Gene = require('../models/gene');
const router = express.Router();


// GET route for addGene page
router.get('/', (req, res) => {
    res.render('addGene', { message: null, error: null });
});

// POST route for adding a gene
router.post('/addGene', async (req, res) => {
    try {
        const newGene = new Gene({
            geneName: req.body.geneName,
            species: req.body.species || undefined,
            fastaSeq: req.body.fastaSeq,
        });
        await newGene.save();
        res.render('addGene', { message: 'Gene successfully saved!' });
    } catch (err) {
        console.error('Error saving gene:', err);
        res.status(500).render('addGene', { error: 'Error saving gene' });
    }
});

module.exports = router;