//model acts as a builder and allows you to create, read, update and delete documents in DB

const mongoose = require("mongoose");

//THIS IS THE SCHEMA
//trimmed removes accidental whitespaces
const geneSchema = new mongoose.Schema({
    geneName: {
        type: String,
        required: true,
        unique: true,
        trim: true,

    },
    species: {
        type: String, required: false, default: "unknown", trim: true, validate: {
            validator: function (v) {
                // Returns false if the input is only numeric
                return isNaN(v);
            },
            message: props => `${props.value} is a number! Gene name must contain text.`
        }
    },
    fastaSeq: {
        type: String,
        required: true,
        // Match nucleotide seqeunces only
        match: [/^[ACGTU]+$/i, 'Invalid sequence format']
    },
    gc_content: {
        type: Number
    },
},
    // {
    //     timestamps: true //If i want to have when things where added
    // }
)

geneSchema.pre('save', function () {
    if (!this.isModified('fastaSeq')) {
        return;
    }
    const sequence = this.fastaSeq;

    if (sequence && sequence.length > 0) {
        const gcMatches = sequence.match(/[GC]/gi);
        const gcCount = gcMatches ? gcMatches.length : 0;

        const gcPercentage = (gcCount / sequence.length) * 100;
        this.gc_content = Number(gcPercentage.toFixed(2));
    } else {
        this.gc_content = 0;
    }
});

//Model
const Gene = mongoose.model("Gene", geneSchema);

//Module exports
module.exports = Gene;
