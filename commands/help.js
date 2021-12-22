const prefix = process.env.PREFIX;
module.exports = {
    name: 'help',
    aliases: ['halp','command','h'],
    description: 'List of all bot commands',
    permissions: '',
    cooldown:'0',
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
            const {commands} = message.client;
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            if(!args.length){
                const Embed = new Discord.MessageEmbed()
                .setTitle(`To manage the bot settings please type ${process.env.PREFIX}settings`)
                .setColor(randomColor)
                .setDescription(`Here's list of all my commands:`)
                //.setDescription(commands.map(command => command.name).join(' , \n'))
                .addFields(
                    {name:':vibration_mode: Basic/Moderation commands :vibration_mode:', value:":small_orange_diamond: settings :small_orange_diamond: help :small_orange_diamond:  mute :small_orange_diamond: verify :small_orange_diamond: prefix :small_orange_diamond: ping :small_orange_diamond:  disable :small_orange_diamond:", inline:false},
                    {name:':bank: Economy commands :bank:', value:":small_blue_diamond: balance :small_blue_diamond: beg :small_blue_diamond: deposit :small_blue_diamond: withdraw :small_blue_diamond: shop :small_blue_diamond:", inline:false},
                    {name:':confetti_ball: Features :confetti_ball:', value:":diamonds: image :diamonds: avatar :diamonds: meme :diamonds: lottery :diamonds: counting :diamonds:", inline:false},
                    {name:':microphone: Music player commands :microphone:', value:":musical_note: play :musical_note: next :musical_note: stop :musical_note: queue :musical_note: loop :musical_note: skipto :musical_note: pause :musical_note: resume :musical_note: volume :musical_note: lyrics :musical_note:", inline:false},
                    )
                .setFooter(`Type ${prefix}help [command name] to get info about the command!`)
                message.channel.send(Embed);
                return;
            }
            
            const name = args[0];
            const comd = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            if(!comd){
                message.reply(`**You didn't provide any command name!**`);
                return;
            }
            
                const DataEmbed = new Discord.MessageEmbed()
                .setTitle(`:speech_left: Information about ${prefix}${comd.name} command:`)
                .setColor(randomColor)
                .addFields(
                    { name: ':regional_indicator_c: Command Name', value: `${comd.name}` },
                    { name: ':regional_indicator_d: Description:', value: comd.description, inline: false },
                    { name: ':regional_indicator_a: Aliases:', value:`${comd.aliases},`, inline: false },
                    { name: ':regional_indicator_c: Cooldown:', value: `${comd.cooldown}`, inline: false },
                    { name: ':regional_indicator_p: Mandatory permissions:', value: comd.permissions, inline: false}
                )
                
            
            message.channel.send(DataEmbed);
    }
}