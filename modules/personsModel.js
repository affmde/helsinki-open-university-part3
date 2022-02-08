const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    name: {
        type: String
    },
    number:{
        type: String
    }
})

const PersonModel = mongoose.model('person', personSchema);
module.exports= PersonModel