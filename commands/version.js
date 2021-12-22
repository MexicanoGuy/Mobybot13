
module.exports = {
    name: 'version',
    description: `You can check the current version of Moby, if it tells you anything :D`,
    permissions:["SPEAK","CONNECT"],
    cooldown:'2',

    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild,randomColor){
        const botVersion = require(`../package-lock.json`).version
        message.channel.send(`**Current version of the Mobybot is ${botVersion} **`);
    }
}