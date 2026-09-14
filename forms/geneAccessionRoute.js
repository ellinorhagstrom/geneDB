const express = require('express');
const Gene = require('../models/gene');
const router = express.Router();
const axios = require("axios")
const { parseStringPromise } = require('xml2js');

// POST route for adding a gene
router.post('/', async (req, res) => {
    try {
        const accession = req.body.accessionNumber?.trim();

        // format check before hitting API
        if (!accession || !/^[A-Za-z0-9_.]+$/.test(accession)) {
            return res.render('addGene', {
                message: null,
                error: 'Please enter a valid accession number.',
                gcContent: null
            });
        }

        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=nuccore&id=${encodeURIComponent(accession)}&rettype=gb&retmode=xml`;
        console.log(`Fetching from NCBI: ${url}`);

        const response = await axios.get(url);
        const parsed = await parseStringPromise(response.data);
        const gbSeq = parsed?.GBSet?.GBSeq?.[0];


        if (!gbSeq) {
            return res.render('addGene', {
                message: null,
                error: 'Accession not found in NCBI nucleotide database.',
                gcContent: null
            });
        }

        const sequence = gbSeq.GBSeq_sequence?.[0]?.toUpperCase();
        const organism = gbSeq.GBSeq_organism?.[0] || 'unknown';
        const geneName = gbSeq.GBSeq_locus?.[0] || gbSeq.GBSeq_definition?.[0] || accession;

        if (!sequence) {
            return res.render('addGene', {
                message: null,
                error: 'No sequence data found for that accession number.',
                gcContent: null
            });
        }

        // Map data to the Gene model fields
        const newGene = new Gene({
            geneName,
            species: organism,
            fastaSeq: sequence
        });

        const savedGene = await newGene.save();
        console.log('Successfully saved to MongoDB:', savedGene._id);

        res.render('addGene', {
            message: 'Gene successfully added from NCBI!',
            error: null,
            gcContent: savedGene.gc_content
        });

    } catch (err) {
        console.error(err);
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

//Example accession number: P01308