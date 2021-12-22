const profileModel = require(`../models/profileSchema`);
module.exports = {
    name:'beg',
    description:'gives random amount of money up to 30$M',
    aliases:['bag','b'],
    cooldown:'180',
    permissions:['SEND_MESSAGES'],
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(disabledData[module.exports.name]==="true") return message.reply(`** \`${module.exports.name}\` command is disabled in this guild, ask discord mod to enable this command!**`);
        const random = 30;
        var randomBeg = Math.floor(Math.random() * random) + 1;
        const response = await profileModel.findOneAndUpdate({
            userID: message.author.id,
            },
            {
            $inc: {
                coins: randomBeg,
            },
        });
        return message.reply(`*You begged for: **${randomBeg}**$*`);
    }
}