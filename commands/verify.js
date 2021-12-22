module.exports = {
    name:'verify',
    description:'Creates Embed with verify Emoji to receive a verified role',
    aliases:['ver','vy'],
    permissions:["ADMINISTRATOR"],
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(disabledData[module.exports.name]==="true") return message.reply(`** \`${module.exports.name}\` command is disabled in this guild, ask discord mod to enable this command!**`);
        const verified = message.guild.roles.cache.find(role => role.name === "verified");
        let channel = message.guild.channels.cache.find(ch => ch.id === guildData.verifyCh);
        if(!verified){
            guild.roles.create({
            data:{
                name: 'verified',
                color: 'GREEN',
                permissionOverwrites: [
                    'C0NNECT',
                    'SPEAK',
                    'SEND_MESSAGES',
                    'ATTACH_LINKS',
                    'VIEW_CHANNEL',
                    'EMBED_LINKS',
                ]
            },
            });
            return message.channel.send(`:construction_site: **I created a new role called "verified"! Please use this command again in the ${channel.name} text channel to execute it!** :construction_site:`);
        }
        if(verified && !channel){        
        return message.channel.send(`**Please setup the default channel by using the \`${process.env.PREFIX}settings verify\` command!**`);
        }
        if(!verified && !channel){
                guild.roles.create({
                data:{
                    name: 'verified',
                    color: 'GREEN',
                },
                });
                return message.channel.send(`:construction_site: **I created a new role called "verified"! Please use this command again in "verify" text channel to execute it!** :construction_site:`);
        }
        if(message.channel.id == channel){
            
            
            const verifyemoji = '✅';   
            let serverIcon = message.guild.iconURL();
                let embed = new Discord.MessageEmbed()
                .setColor('#e42643')
                .setTitle(`Welcome to ${guild.name}!\n`)
                .setImage(serverIcon)
                .setDescription('Please check the rules and then verify yourself!')
                .setFooter('Click down here!'
                + `${verifyemoji}`)
            let messageEmbed = await message.channel.send(embed);
            messageEmbed.react(verifyemoji);
        bot.on('messageReactionAdd', async(reaction,user) =>{
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(reaction.message.channel.id == channel){
               if(reaction.emoji.name === verifyemoji){
                await reaction.message.guild.members.cache.get(user.id).roles.add(verified);
               }
            }else{
                return;
            }
        });
        bot.on('messageReactionRemove', async(reaction,user) =>{
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(!reaction.message.guild) return;
            if(user.bot) return;
            if(reaction.message.channel.id == channel){
                if(reaction.emoji.name === verifyemoji){
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(verified);
                   }
            }else{
                return;
            }
        });
        guildData.save();
        }
        if(guildData.verifyCh === null) return message.channel.send(`**Please setup the default channel by using the \`${process.env.PREFIX}settings verify\` command!**`);
        if(message.channel.id !== guildData.verifyCh){
            return message.channel.send(`:no_entry_sign: <@${message.author.id}> **You can only use that command in channel called "${channel}"!** :no_entry_sign:`);
        }
    }
    
}