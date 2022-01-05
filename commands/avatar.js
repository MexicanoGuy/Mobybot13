module.exports = {
    name: 'avatar',
    description:'Sends your avatar or someone elses.',
    aliases: ['icon'],
    permissions:["SEND_MESSAGES"],
    cooldown:"2",
    async execute (message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(disabledData[module.exports.name]==="true") return message.reply(`** \`${module.exports.name}\` command is disabled in this guild, ask discord mod to enable this command!**`);
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        if(!args.length){
            let AvatarEmbed = new Discord.MessageEmbed()
            .setTitle(`Your Avatar:`)
            .setColor(randomColor)
            .setImage(message.author.displayAvatarURL())
            return message.reply(AvatarEmbed);
        }
        if(message.mentions.users.first()){
            let user = message.mentions.users.first();
            //message.channel.send(User.displayAvatarURL());
            let AvatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${user.tag} Avatar:`)
            .setColor(randomColor)
            .setImage(user.displayAvatarURL())
            return message.reply(AvatarEmbed);
        }else{
            return message.channel.send(`**This user doesn't exist!**`);
        }
    }
}