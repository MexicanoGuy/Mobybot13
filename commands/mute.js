module.exports = {
    name:'mute',
    description:`Allows to mute pinged user, you need to have right permission to use this command.`,
    aliases:['mt','m'],
    permissions:["SEND_MESSAGES","SPEAK","CONNECT"],
    cooldown:300,
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild){
      const channel = message.channel;
      let user = message.mentions.users.first();
        if(!message.mentions.users.first()) return message.reply("you need to ping someone to allow me to mute him!");
        if(user.bot) return message.channel.send(`**You can't mute me!**`);
                let mutedRole = message.guild.roles.cache.find(role => role.name === "muted");
                let target = message.guild.members.cache.get(user.id);
                if(message.member.roles.cache.find(r => r.name === "muted")) return message.channel.send(`**User has already been muted!**`)
                if(mutedRole){
                  channel.overwritePermissions([
                    {
                      id: mutedRole.id,
                      allow: ["READ_MESSAGE_HISTORY"],
                      deny:["SEND_MESSAGES","CREATE_INSTANT_INVITE","SPEAK","CONNECT","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS"]
                    }
                  ]);  
                target.roles.add(mutedRole);
                message.channel.send(`:zipper_mouth: **${user} has been muted for 5 minutes** :zipper_mouth:`)
                setTimeout(()=>{
                  target.roles.remove(mutedRole);
                  return message.channel.send(`${target} has been unmuted!`);
                },300000)
            }else{
              guild.roles.create({
              data:{
                name: 'muted',
                color: 'BLACK',
                allow: ["VIEW_MESSAGES"],
                deny: ["SEND_MESSAGES","CREATE_INSTANT_INVITE","SPEAK","CONNECT","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS"]
              },
              });
              message.reply(`Please re-run this command to mute a user!`);
            }
    }
}