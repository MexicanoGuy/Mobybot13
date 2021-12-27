module.exports = {
    name: 'lottery',
    permissions: ['SEND_MESSAGES'],
    cooldown: 1,
    aliases: ['rng', 'random'],
    description: 'Easy to use random number generator. You can choose range by typing **$lottery *minNumber maxNumber* **',

    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild,randomColor){
        
        
        if(args[0] && args[1]){
            if(!args[0] || !args[1] || Number.isNaN(args[0]) || Number.isNaN(args[1]) || args[0] < 0 || args[1] < 0 ) return message.channel.send(`**Please specify min and max as numbers(must be greater than zero)! Example: $lottery *minNumber maxNumber*  **`)
            var min = parseInt(args[0]);
            var max = parseInt(args[1]);
            var mathRandom = Math.floor(Math.random() * (max - min) + min);
            let LotteryEmbed = new Discord.MessageEmbed()
            .setTitle(`Lottery for ${message.author.tag}`)
            .setColor(randomColor)
            .setDescription(`Your number is: ${mathRandom}`)
            return message.reply(LotteryEmbed);

        }else{
            const random = 200;
            var lottery = Math.floor(Math.random() * (random - 1 + 1)) + 1;
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            let LotteryEmbed = new Discord.MessageEmbed()
            .setTitle(`Lottery for ${message.author.tag}`)
            .setColor(randomColor)
            .setDescription(`Your number is: ${lottery}`)
            return message.reply(LotteryEmbed);
        }
    }

}