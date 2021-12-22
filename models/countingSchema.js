const mongoose = require("mongoose");
const countingStats = new mongoose.Schema({
    guildId: {type: String, require: true, unique: true},
    count: {type: Number, require: true},
    leader: {type: String, require: true },
    record: {type: Number, require: true},
    temp: {type: String, require: true},
});
const counting = mongoose.model('CountingModels',countingStats);
module.exports = counting;