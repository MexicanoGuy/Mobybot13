const countingModel = require(`../models/countingSchema`);
const guildModel = require(`../models/guildSchema`);
const profileModel = require(`../models/profileSchema`);
module.exports = {
    name: 'counting',
    description: 'This is minigame. Point of this minigame is to make the biggest count, so try not to screw it up!',
    permissions:['SEND_MESSAGES'],
    aliases:["c","currentcount",'count','leader','score','cc','stats'],
    cooldown:1,
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        if(disabledData[module.exports.name]==="true") return message.reply(`** \`${module.exports.name}\` command is disabled in this guild, ask discord mod to enable this command!**`);
        const channel = bot.channels.cache.find(ch => ch.id === guildData.countingCh);
        if(!channel) channel = bot.channels.cache.find(ch => ch.name === guildData.countingCh);
        if(!channel) channel = bot.channels.cache.find(ch => ch.name === "counting");
        const cantCountRole = message.guild.roles.cache.find(r => r.name === "Can't freakin' count");
        if(!cantCountRole){
            guild.roles.create({
                data: {
                    name: `Can't freakin' count`,
                    color: 'RED',
                },
                reason: `Can't freakin' count`,
            });
        }
        if(!countingData){
            let container = await countingModel.create({
                guildId: message.guild.id,
                count: 1,
                leader:'',
                record:1,

            });
            message.channel.send(`**This is the first time running this command, so please re-run it!\nYou can also use this to change the counting channel: ${process.env.PREFIX}settings counting \`channel id\` **`);
            return container.save();
        }
        let target = message.mentions.members.first();
        
        if(commandName==="currentcount" || commandName==="cc"){
            return message.reply(`Current count is: ${countingData.count}, just type this number!`);
        }
        if(commandName==="counting" || commandName==="c"){
            if(message.channel==channel){
                const number = args[0];
                if(isNaN(args[0])) return message.delete();
                if(!number) return message.reply(`you need to type the number first!`);
                    //if(message.author.id===countingData.temp){
                        //return message.reply(`You can't count number two times in the row!`);
                    //}else{
                        var temp;
                        if(number==countingData.count){
                                message.react('✅');
                                temp = countingData.count;
                                countingData.count++;
                                profileData.allCounts++;
                                profileData.goodCounts++;
                        }else{
                                message.react('❌')
                                temp = countingData.count;
                                countingData.count=1;
                                profileData.badcounts++;
                                message.member.roles.add(cantCountRole);
                                message.channel.send(`♨️**Wrong! *<@${message.author.id}>* has screwed it up! Next count starts from 1**♨️`);
                        }
                            if(temp > countingData.record){
                                countingData.leader = message.author.tag;
                                countingData.record = temp;
                            }
                            countingData.temp = message.author.id;
                            countingData.save();
                            return profileData.save();
                    //}
            }else{
                return message.reply(`please use the: ${process.env.PREFIX}settings counting \`channel id\``);
            }
        }
        if(commandName==="leader"){
            let leaderEmbed = new Discord.MessageEmbed()
            .setTitle(`Leader of the counting`)
            .setDescription(`The leader is: ${countingData.leader}. \n With score of: ${countingData.record}`)
            .setColor(`#f5bf42`)
            return message.channel.send(leaderEmbed);
        }
        if(commandName==="score" || commandName === "stats"){
            let targetProfile = profileData;
            target = message.author;
            if(message.mentions.members.first()){
                targetProfile = await profileModel.findOne({userID: target.id});
                target = message.mentions.users.first();
            }
            if(!targetProfile) return message.reply(`There's no such a member!`)
            var percent = targetProfile.goodCounts / targetProfile.allCounts * 100;
            percent = Math.round(percent) + "%";
            let myScoreEmbed = new Discord.MessageEmbed()
            .setDescription(`Here's stats for: <@${target.id}>`)
            .addFields(
                {name:'All counts:', value: targetProfile.allCounts, inline: false},
                {name:'Good counts:', value: targetProfile.goodCounts, inline: false},
                {name:'Bad counts:', value: targetProfile.badcounts},
                {name:'Average percentage of good counts:', value:percent, inline:false},
                //{name:'Achievements, value: profileData.achievements'},
                )
            .setColor(`#f5bf42`)
            .setImage(target.avatarURL())
            return message.channel.send(myScoreEmbed);
        }
        
    }
}