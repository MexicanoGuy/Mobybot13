const guildModel = require(`../models/guildSchema`);
module.exports = {
    name:'settings',
    description:`Setup bot settings for your guild. To do so please type settings for more information!`,
    permissions:['ADMINISTRATOR','MANAGE_CHANNELS'],
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(!args[0]){
            let settingsEmbed = new Discord.MessageEmbed()
                .setTitle(`:gear: Moby Settings`)
                .addFields(
                        {name:':regional_indicator_d: Disable/ :regional_indicator_e: Enable',value:`**Type *${process.env.PREFIX}settings disable/enable \`command name\`* **`, inline:true},
                        {name:':heavy_dollar_sign: Prefix', value:`**Type *${process.env.PREFIX}settings prefix \`new prefix\`* to change the prefix for this guild. **`, inline:true},
                        {name:':wave: Arrivals/Departures', value:`**You can set the channel, where new members will be welcomed!.\nSimply type: *${process.env.PREFIX}welcome/departures \`channel name\`* **`},
                        {name:':white_check_mark: Verify', value:`**To setup the verify channel, please type: *${process.env.PREFIX}settings verify \`channel id\`* **`, inline:true},
                        {name:':1234: Counting :1234:', value:`**To setup the counting (minigame) channel, please type: *${process.env.PREFIX}settings counting \`channel id\`* **`},
                        {name:':handshake: Member counter :handshake:', value:`**To setup the member counter, please type: *${process.env.PREFIX}settings membercounter \`VOICECHANNEL id\`* **`},
                        {name:':laughing: Daily memes :laughing:', value: `**To setup the dailymemes channel, please type: *${process.env.PREFIX}settings dailymemes channel \`channel id\`.\n You can set when the memes will be send: ${process.env.PREFIX}settings dailymemes time \`minutes\`* **`, inline:true},
                    )
                .setColor(`#0328fc`)
                .setTimestamp()

            return message.channel.send(settingsEmbed);
        }
        if(args[0] === 'dailymemes'){
            if(args[1] === 'channel'){
                if(!args[2]) return message.channel.send(`**Please type the channel \`id\`, where memes will be send! **`);
                    const dailyM = message.guild.channels.cache.find(ch => ch.id === args[2])
                if(!dailyM) return message.channel.send(`There's no such a text channel, please create a valid one and give me the right \`id\`.`);
                    guildData.dailyMemes = dailyM;
                message.channel.send(`**Text channel for daily memes is now: \`${dailyM.name}\``);
            }
            if(args[1] === 'time'){
                if(!args[0] || isNaN(args[0])) return message.channel.send(`**Please type the time (in minutes) when the memes will be send (example 5) **`);
                if(minutes < 5) return message.channel.send(`**Minutes can't be less than 5!**`);
                var minutes = args[0];
                if(guildData) guildData.dailyMemesDate = minutes;
                    
            }
            const randomPuppy = require(`random-puppy`);
            const subReddits = ['Memes','Dankmemes','Funny','AdviceAnimals','ComedyCemetery','PrequelMemes'];
            const random = subReddits[Math.floor(Math.random() * subReddits.length)];
            setInterval( () =>{    
                
                message.channel.send(randomPuppy(1));
            },minutes*600)
        }
        if(args[0]=="counting"){
            if(!args[1]) return message.channel.send(`Please type the channel id as the second argument!`);
            const channel = message.guild.channels.cache.find(ch => ch.id === args[1]);
            if(!channel) return message.channel.send(`<@${message.author.id}>! This channel doesn't exist! Make sure you are having right id!`);
            guildData.countingCh = args[1];
            guildData.save();
            return message.channel.send(`Welcome channel has been set to: ${channel.name}!`);
        }
        if(args[0]=="welcome"){
            if(!args[1]) return message.channel.send(`Please type the channel id as the second argument!`);
            const channel = message.guild.channels.cache.find(ch => ch.id === args[1]);
            if(!channel) return message.channel.send(`<@${message.author.id}>! This channel doesn't exist! Make sure you are having right id!`);
            guildData.welcome = args[1];
            guildData.save();
            return message.channel.send(`Welcome channel has been set to: ${channel.name}!`);
        }
        if(args[0]=="departures"){
            if(!args[1]) return message.channel.send(`Please type the channel id as the second argument!`);
            const channel = message.guild.channels.cache.find(ch => ch.id === args[1]);
            if(!channel) return message.channel.send(`<@${message.author.id}>! This channel doesn't exist! Make sure you are having right name!`);
            guildData.departures = args[1];
            guildData.save();
            return message.channel.send(`Departures channel has been set to: ${channel.name}!`);
        }
        if(args[0]=="prefix"){
                if(!args[1]) return message.reply(`**please type a new prefix as one word!**`);
                if(guildData){
                    guildData.prefix = args[1];
                    await guildModel.findOneAndUpdate({
                        guildID: guild.id,
                        prefix: args[1],
                    });
                }  
                   return message.channel.send(`**Prefix has been changed to \`${args[1]}\`**`);
        }
        var allBotsCommands = ["avatar","balance","beg","counting","deposit","image","leave","lottery","meme","mute","play","verify","withdraw","shop"];
        if(args[0]=="disable"){
            if(!args[0]){
                message.channel.send(`**List of all the commands you can disable:**\n \`${allBotsCommands}\` `);
            }
            if(args[0]){
                if(!allBotsCommands.includes(args[1])) return message.channel.send(`:grey_question: **There's no such a command** :grey_question:`);
                disabledData[args[1]] = true;
                disabledData.save();
                return message.channel.send(`:capital_abcd: ** \`${args[1]}\` command has been disabled!** :capital_abcd:`)
            }
        }
        if(args[0]=="enable"){
            if(!args[1]){
                message.channel.send(`**List of all the commands you can enable:**\n \`${allBotsCommands}\` `);
            }
            if(args[0]){
                if(!allBotsCommands.includes(args[1])) return message.channel.send(`:grey_question: **There's no such a command** :grey_question:`);
                disabledData[args[1]] = false;
                disabledData.save();
                return message.channel.send(`:capital_abcd: ** \`${args[1]}\` command has been enabled!** :capital_abcd:`)
            }
        }
        if(args[0]=="dailymemes"){
            //message.channel.send(`**Please give me the channel name where memes will be sent regularly! Then**`)
            //in progress
        }
        if(args[0]=="membercounter"){
            if(args[1]==='mc'){
                if(!guildData.memberCounter) return message.channel.send(`**You haven't set channel id before, please do this by typing: \`${process.env.PREFIX}settings membercounter channelId \` **`)
                let allMembers = guild.memberCount.toLocaleString();
                const theChannelId = message.guild.channels.cache.get(guildData.memberCounter);
                theChannelId.setName(`Total members: ${allMembers}`);
            }
            else{
                var check = message.guild.channels.cache.get(args[1]);
                if(!check) return message.channel.send(`**There's no such a voiceChannel, make sure you have right id!**`);
                    if(guildData.memberCounter){
                        let guildDat = await guildModel.create({
                            guildID: message.guild.id,
                            memberCounter: args[1],
                        });
                        guildDat.save();
                        return message.channel.send(`**The member counter has been set to \`${check.name}\`.\nPlease wait until someone new joins this server,\nor just run this command again with ${process.env.PREFIX}membercounter mc**`);
                    }
                    if(args[1] && guildData.memberCounter){
                        guildData.memberCounter = args[1];
                        guildData.save();
                        console.log('shit');
                        return message.channel.send(`**The member counter has been set to \`${check.name}\`.\nPlease wait until someone new joins this server,\nor just run this command again with: ${process.env.PREFIX}membercounter mc**`);
                    }
            }
        }
        if(args[0]=="verify"){
            if(!args[1]) return message.channel.send(`**<@${message.author.id}>! Please provide a valid channel id!**`);
            const searchCh = message.guild.channels.cache.get(args[1]);
            if(!searchCh) return message.channel.send(`** I couldn't find any channel with this id! Please provide a valid textChannel id! **`)
            guildData.verifyCh = args[1];
            message.channel.send(`**Verification channel has been set now for: ${searchCh.name} **`);
        }
    guildData.save();
    }
}