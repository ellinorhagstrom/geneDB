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
                // Returns false if the input is purely numeric
                return isNaN(v);
            },
            message: props => `${props.value} is a number! Gene name must contain text.`
        }
    },
    fastaSeq: {
        type: String, required: true, uppercase: true, trim: true, match: [
            /^[ATCGU]+$/i,
            'FASTA sequence must only contain valid nucleotide characters (A, T, C, G, U).'
        ]
    },
    gc_content: {
        type: Number
    },
},
    // {
    //     timestamps: true
    // }
)

geneSchema.pre('save', function () {
    if (!this.isModified('fastaSeq')) {
        return;
    }
    const sequence = this.fastaSeq;

    if (sequence && sequence.length > 0) {
        const gcMatches = sequence.match(/[GC]/g);
        const gcCount = gcMatches ? gcMatches.length : 0;

        const gcPercentage = (gcCount / sequence.length) * 100;
        this.gc_content = Number(gcPercentage.toFixed(2));
    } else {
        this.gc_content = 0;
    }
});

//MODEL
const Gene = mongoose.model("Gene", geneSchema);

//Module exports
module.exports = mongoose.model("Gene", geneSchema);


