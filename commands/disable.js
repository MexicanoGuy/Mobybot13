module.exports = {
    name:'disable',
    description:`If you want to disable any command type ${process.env.PREFIX}disable + "commandName". Enable by typing ${process.env.PREFIX}enable + "commandName"`,
    aliases: ['disable','enable'],
    permissions:["ADMINISTRATOR"],
    cooldown:"0",
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        var allBotsCommands = ["avatar","balance","beg","counting","deposit","image","leave","lottery","meme","mute","play","verify","withdraw","shop"];
        if(commandName==="disable"){
            if(!args[0]){
                message.channel.send(`**List of all the commands you can disable:**\n \`${allBotsCommands}\` `);
            }
            if(args[0]){
                if(!allBotsCommands.includes(args[0])) return message.channel.send(`:grey_question: **There's no such a command** :grey_question:`);
                disabledData[args[0]] = true;
                disabledData.save();
                return message.channel.send(`:capital_abcd: ** \`${args[0]}\` command has been disabled!** :capital_abcd:`)
            }
        }
        if(commandName==="enable"){
            if(!args[0]){
                message.channel.send(`**List of all the commands you can enable:**\n \`${allBotsCommands}\` `);
            }
            if(args[0]){
                if(!allBotsCommands.includes(args[0])) return message.channel.send(`:grey_question: **There's no such a command** :grey_question:`);
                disabledData[args[0]] = false;
                disabledData.save();
                return message.channel.send(`:capital_abcd: ** \`${args[0]}\` command has been enabled!** :capital_abcd:`)
            }
        }
        
    }
}