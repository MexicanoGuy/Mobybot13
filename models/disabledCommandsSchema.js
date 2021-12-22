const mongoose = require(`mongoose`);
const disabled = new mongoose.Schema({
    guildID: {type: String, require: true, unique: true},
    balance: {type: String, require: true, default:'false'},
    beg: {type: String, require: true, default:'false'},
    counting: {type: String, require: true, default:'false'},
    deposit: {type: String, require: true, default:'false'},
    image: {type: String, require: true, default:'false'},
    leave: {type: String, require: true, default:'false'},
    lottery: {type: String, require: true, default:'false'},
    meme: {type: String, require: true, default:'false'},
    mute: {type: String, require: true, default:'false'},
    play: {type: String, require: true, default:'false'},
    verify: {type: String, require: true, default:'false'},
    withdraw: {type: String, require: true, default:'false'},
    avatar: {type: String, require: true, default:'false'},
});
const disable = mongoose.model(`DisabledCommandsModel`, disabled);
module.exports = disable;