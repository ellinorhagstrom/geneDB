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

        // Validation for geneName to not be number
        if (!geneName || !geneName.trim() || !fastaSeq || !fastaSeq.trim()) {
            return res.render('addGene', {
                message: null,
                error: 'Gene name and sequence are required.',
                gcContent: null
            });
        }

        // Validation for species to not be purely numeric
        if (species && !isNaN(species) && species.trim() !== "") {
            return res.render('addGene', {
                message: null,
                error: 'Species cannot be a number.',
                gcContent: null
            });
        }

        // Validates that the sequence only contains nucleotide characters
        const nucleotideRegex = /^[ACGTU]+$/i;
        if (!nucleotideRegex.test(fastaSeq.trim())) {
            return res.render('addGene', {
                message: null,
                error: 'Invalid sequence: must only contain A, T, C, G, or U characters.',
                gcContent: null
            });
        }


        const newGene = new Gene({
            geneName: geneName.trim(),
            species: species?.trim() || undefined,
            fastaSeq: fastaSeq.trim().toUpperCase()
        });

        const savedGene = await newGene.save(); //calculates the pre('save') method

        res.render('addGene', {
            message: 'Gene successfully added to the database!',
            error: null,
            gcContent: savedGene.gc_content
        });
    } catch (err) {
        const errorMessage = err.code === 11000
            ? 'A gene with that name already exists in the database.'
            : 'Failed to add gene: ' + err.message;

        res.render('addGene', {
            message: null,
            error: errorMessage,
            gcContent: null
        });
    }
});





module.exports = router;