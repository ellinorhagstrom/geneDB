const express = require('express');
const Gene = require('../models/gene');
const router = express.Router();

// GET: Render form initially with empty messages (for now the homwscreen)
router.get('/', (req, res) => {
    res.render('addGene', {
        message: null,
        error: null,
        gcContent: null
    });
});

// POST route for adding a gene
router.post('/', async (req, res) => {
    try {
        const { geneName, species, fastaSeq } = req.body;

        //Validation for geneName to not be number
        if (!isNaN(species) && species.trim() !== "") {
            return res.render('addGene', {
                message: null,
                error: 'Gene name cannot be a number.',
                gcContent: null
            });
        }

        //Validates that sequences is only of real nucleotides
        const nucleotideRegex = /^[ATCGU]+$/i;
        if (fastaSeq && !nucleotideRegex.test(fastaSeq.trim())) {
            return res.render('addGene', {
                message: null,
                error: 'Invalid sequence: Must only contain A, T, C, G, or U characters.',
                gcContent: null
            });
        }


        const newGene = new Gene({
            geneName: geneName,
            species: species || undefined,
            fastaSeq: fastaSeq
        });

        const savedGene = await newGene.save(); //calculates the pre('save') method

        res.render('addGene', {
            message: 'Gene successfully added to the database!',
            error: null,
            gcContent: savedGene.gc_content
        });
    } catch (err) {
        res.render('addGene', {
            message: null,
            error: 'Failed to add gene: ' + err.message,
            gcContent: null
        });
    }
});


module.exports = router;