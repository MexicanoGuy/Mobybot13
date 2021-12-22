const mongoose = require(`mongoose`);
const guildSchema = new mongoose.Schema({
    guildID: {type: String, require: true, unique: true},
    verifyCh: {type: String, require: true},
    verifyLastMsg: {type: String, require: true},
    countingCh: {type: String, require: true, default:'counting'},
    welcome:{type: String, require: true, default:'welcome'},
    departures:{type: String, require: true, default:'departures'},
    memberCounter:{type: String, require: true, unique:true, default:''},
    prefix:{type: String, require: true, default:`${process.env.PREFIX}`},
    dailyMemesCh: {type: String, require: true},
    dailyMemesDate: {type: String, require: true, default:'5'},
});
const guilds = mongoose.model('GuildModels', guildSchema);
module.exports = guilds;