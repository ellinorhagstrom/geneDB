//model acts as a builder and allows you to create, read, update and delete documents in DB

const mongoose = require("mongoose");

//THIS IS THE SCHEMA
//trimmed removes accidental whitespaces
const geneSchema = new mongoose.Schema({
    geneName: {
        type: String, required: true, unique: true, trim: true
    },
    species: {
        type: String, required: false, default: "unknown", trim: true
    },
    fastaSeq: {
        type: String, required: true, uppercase: true, trim: true
    },
    // gc_content: {
    //     type: Number
    // },
    // tags: [{
    //     type: String, trim: true
    // },
    // ],
}, {
    timestamps: true
})

// geneSchema.pre('save', function () {
//     if (!this.isModified('fastaSeq')) {
//         return;
//     }

//     const sequence = this.fastaSeq;

//     if (sequence && sequence > 0) {
//         const gcMatches = sequence.match(/[GC]/g);
//         const gcCount = gcMatches ? gcMatches.length : 0;

//         const gcPercentage = (gcCount / sequence.length) * 100;
//         this.gc_content = Number(gcPercentage.toFixed(2));
//     } else {
//         this.gc_content = 0;
//     }
// });

//MODEL
const Gene = mongoose.model("Gene", geneSchema);

//Module exports
module.exports = mongoose.model("Gene", geneSchema);


