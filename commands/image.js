var Scraper = require('images-scraper');
const google = new Scraper({
    puppeteer: {
      headless: true,
    },
});
module.exports = {
    name: 'image',
    description:'sends specified image from internet',
    aliases: ['photo'],
    cooldown: '5',
    permissions:['SEND_MESSAGES'],

    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(disabledData[module.exports.name]==="true") return message.reply(`** \`${module.exports.name}\` command is disabled in this guild, ask discord mod to enable this command!**`);
        const image = args.join(' ');
            if(!image) return message.reply(`You need first to type a keyword!`);
        try{
            const results = await google.scrape(image, 1);
            message.channel.send(results[0].url);
        }catch(err){
            message.channel.send(`**I couldn't find \`${image}\` **`);
        }
    }
}