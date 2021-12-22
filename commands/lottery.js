const Discord = require(`discord.js`);
module.exports = {
    name: 'lottery',
    description: 'This is mini-something-game.',
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        const random = 500;
        var lottery = Math.floor(Math.random() * (random - 1 + 1)) + 1;
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        let LotteryEmbed = new Discord.MessageEmbed()
        .setTitle(`Lottery for ${message.author.tag}`)
        .setColor(randomColor)
        .setDescription(`Your number is: ${lottery}`)
        message.reply(LotteryEmbed);
    }

}