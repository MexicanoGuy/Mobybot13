const prefix = process.env.PREFIX;
const profileModel = require('../models/profileSchema');
module.exports = {
    name: 'withdraw',
    description: 'allows you to withdraw your $M money to the bank',
    permissions:['SEND_MESSAGES'],
    cooldown:"10",
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(disabledData[module.exports.name]==="true") return message.reply(`** \`${module.exports.name}\` command is disabled in this guild, ask discord mod to enable this command!**`);
        const money = args[0];
        if(!money) return message.reply(`**you must type amount of the $M you want to withdraw!**`);
        if(money % 1 !=0 || money <= 0) return message.reply(`You can't withdraw signs!`);
        
        try{
            if(money > profileData.coins) return message.reply(`you don't have enough money in your wallet to withdraw ${money}$` + `!\n Check your bal with **${prefix}balance** !`);
            await profileModel.findOneAndUpdate({
                userID: message.author.id,
                },
                {
                $inc: {
                    coins: money,
                    bank: -money,
                },
            });
            return message.reply(`You have just withdrawed ${money}$ !`);
        }catch(err){
            console.log(err);
        }
            
    }
}