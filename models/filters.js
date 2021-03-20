var mongoose = require('mongoose');

var FilterSchema = mongoose.Schema({
    is_adult: Boolean,
    problems_types: [String],
    localisation: Number,
    gender : [String],
    age : [Number],
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const FilterModel = mongoose.model('filters', FilterSchema);

module.exports = FilterModel;