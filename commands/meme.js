module.exports = {
    name: 'meme',
    description: 'sends a random meme',
    aliases: ['dank'],
    cooldown:'3',
    permissions:['SEND_MESSAGES'],
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        const randomPuppy = require(`random-puppy`);
        const subReddits = ['Memes','Dankmemes','Funny','AdviceAnimals','ComedyCemetery','PrequelMemes'];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const image = await randomPuppy(random);
        const memeEmbed = new Discord.MessageEmbed()
        .setTitle(`From /r/${random}`)
        .setImage(image)
        message.channel.send(image);
    }
}