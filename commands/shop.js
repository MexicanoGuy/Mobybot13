module.exports = {
    name: 'shop',
    aliases: ['shopping','buy','mall'],
    description: 'Welcome to the shop, if you wish to buy anything react with the correct emoji',
    permissions: ['READ_MESSAGE_HISTORY'],
    cooldown:'3',

    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
        const citizen = message.guild.roles.cache.find(role => role.name === "Citizen");
        const president = message.guild.roles.cache.find(role => role.name === "President");
        const Homie = message.guild.roles.cache.find(role => role.name === "Homie");
        const punk = message.guild.roles.cache.find(role => role.name ==="Punk");
        const monke = message.guild.roles.cache.find(role => role.name === "Monke");
        const programmer = message.guild.roles.cache.find(role => role.name === "Programmer");
        const artist = message.guild.roles.cache.find(role => role.name === "Artist");
        const contentCreator = message.guild.roles.cache.find(role => role.name === "ContentCreator");
        if(!citizen){ 
            guild.roles.create({
                data:{
                    name:`Citizen`,
                    color:`#4269f5`
                }
            })
        }
        if(!president){
            guild.roles.create({
                data:{
                    name:`President`,
                    color:`#FFC30B`
                }
            })
        }
        if(!Homie){
            guild.roles.create({
                data:{
                    name:`Homie`,
                    color:`#7ecf1b`
                }
            })
        }
        if(!punk){
            guild.roles.create({
                data:{
                    name:`Punk`,
                    color:`#601bcf`
                }
            })
        }
        if(!monke){
            guild.roles.create({
                data:{
                    name:'Monke',
                    color:`#851e07`
                }
            })
        }   if(!programmer){
            guild.roles.create({
                data:{
                    name:'Programmer',
                    color:'#bd0600'
                }
            })
        }   if(!contentCreator){
            guild.roles.create({
                data:{
                    name:'ContentCreator',
                    color:'#ff5833'
                }
            })
            }
            if(!artist){
                guild.roles.create({
                    data:{
                        name:'Artist',
                        color:'#278a13'
                    }
                })
            }
            if(!args[0]){
                let shopEmbed = new Discord.MessageEmbed()
                    .setTitle(`Shop for roles!`)
                    .setColor(`#eb0909`)
                    .addFields(
                        {name:':art: Artist :art:', value: 'cost: 50$', inline:true},
                        {name:':keyboard: Programmer :keyboard:', value: 'cost: 50$', inline:true},
                        {name:':desktop: ContentCreator :desktop:', value: 'cost: 50$', inline:true},
                        {name:':man_dancing: Cooldude :man_dancing:', value: 'cost 60 $', inline:true},
                        {name:':microbe: Punk :microbe:', value: 'cost: 100$', inline:true},
                        {name:':monkey_face: Monke :monkey_face:', value: 'cost: 150$', inline: true},
                        {name:':man_walking: Citizen :man_walking:', value: 'cost: 175$', inline: true},
                        {name:':olive: Economist :olive:', value: 'cost 200$', inline: true},
                        {name:':tophat: Homie :tophat:', value: 'cost 500$', inline: true},
                        {name:':globe_with_meridians: President :globe_with_meridians:', value: 'cost: 2000$', inline: true},
                    )
                    .setFooter(`Type ${process.env.PREFIX}shop \`role name\` `);
            const emojiea = '✅';
            let messageEmbed = await message.channel.send(shopEmbed);
            }
        const rolesList = {
            Artist:50,
            Programmer:50,
            ContentCreator:50,
            Cooldude:60,
            Punk:100,
            Monke:150,
            Citizen:175,
            Economist:200,
            Homie:500,
            President:2000,
            }
        if(!args[0]) return;
        for(const object in rolesList){
            if(args[0]==object){
                const user = message.member;
                let theRole = message.guild.roles.cache.find(theRole => theRole.name === object);
                let hasRole = message.member.roles.cache.find(hasRole => hasRole.name === object);
                if(!theRole) return message.channel.send(`<@${message.author.id}> this role doesn't exist!`);
                if(hasRole) return message.channel.send(` <@${message.author.id}> you already own this role!`);
                let intek = parseInt(rolesList[object]);
                let intekBank = parseInt(profileData.bank);
                if(intekBank >= intek){
                    await user.roles.add(theRole);
                    profileData.bank -= intek;
                }else{
                    message.channel.send(`<@${message.author.id}> you can't afford it! Make sure you have enough money in your bank account!`);
                }
            }
        }
        profileData.save();
    }
}