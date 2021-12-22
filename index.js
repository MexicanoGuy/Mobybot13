const Discord = require('discord.js');
const bot = new Discord.Client({partials: ["MESSAGE","CHANNEL","REACTION"]});
require('dotenv').config();
const fs = require('fs');
const mongoose = require("mongoose");
var randomColor = Math.floor(Math.random()*16777215).toString(16);
const profileModel = require('./models/profileSchema');
const guildModel = require(`./models/guildSchema`);
const countingModel = require(`./models/countingSchema`);
const disabledModel = require(`./models/disabledCommandsSchema`);
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();  
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      bot.commands.set(command.name, command);
    }
let prefix;   
mongoose.connect(process.env.MONGO_DB_SRV, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log(`Connected to MongoDB!`)
}).catch((err) =>{
  console.log(err)
});
bot.on('message', async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.channel.send(`I don't support dm chatting!`);
  let {guild} = message;
  let countingData = await countingModel.findOne({guildId: message.guild.id});
  let guildData = await guildModel.findOne({guildID: message.guild.id});
  let disabledData = await disabledModel.findOne({guildID: message.guild.id});
  if(guildData){
    prefix = guildData.prefix;
  }else{
    prefix = process.env.PREFIX;
  }
  if(!guildData){
    let guildDat =  await guildModel.create({
      guildID: guild.id,
      countingCh:'counting',
      welcome:'welcome',
      departures:'departures',
    });
    guildDat.save();
  }
  if(!disabledData){
    let disabledDat = await disabledModel.create({
      guildID: guild.id,
      balance:'false',
      beg:'false',
      counting:'false',
      deposit:'false',
      image:'false',
      leave:'false',
      lottery:'false',
      meme:'false',
      mute:'false',
      play:'false',
      verify:'false',
      withdraw:'false',
      avatar:'false',
    });
  disabledDat.save();
  }
  /*if(!guildData){
    let guildDat = await guildModel.create({
        guildID: message.guild.id,
    });
    guildDat.save();
  }*/
  if(message.content.toLowerCase()==="mobyhelp" || message.mentions.has(bot.user)){
    message.channel.send(`**My current prefix on this server is \`${prefix}\`. Please type \`${prefix}help\` for more information**`);
  }
  if(!message.content.startsWith(prefix) || message.author.bot ) return;
      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName= args.shift().toLowerCase();
      const cmd = bot.commands.get(commandName)
      || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if(!cmd) return;
      let profileData
      try{
        profileData = await profileModel.findOne({userID: message.author.id});
          if(!profileData){
            let profile = await profileModel.create({
              userID: message.author.id,
              serverID: message.guild.id,
              coins: 100,
              bank: 0,
          });
          profile.save();
          }
      }catch(err){
        console.log(err);
      }
      if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Discord.Collection());
      }
      
      const now = Date.now();
      const timestamps = cooldowns.get(cmd.name);
      const cooldownAmount = (cmd.cooldown || 3) * 1000;
      
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          if(timeLeft < 6000)return message.channel.send(`**<@${message.author.id}> please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command!**`);
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      
    const validPermissions = [
      "CREATE_INSTANT_INVITE","KICK_MEMBERS","BAN_MEMBERS","ADMINISTRATOR","MANAGE_CHANNELS","MANAGE_GUILD","ADD_REACTIONS","VIEW_AUDIT_LOG","PRIORITY_SPEAKER","STREAM",
      "VIEW_CHANNEL","SEND_MESSAGES","SEND_TTS_MESSAGES","MANAGE_MESSAGES","EMBED_LINKS","ATTACH_FILES","READ_MESSAGE_HISTORY","MENTION_EVERYONE","USE_EXTERNAL_EMOJIS",
      "VIEW_GUILD_INSIGHTS","CONNECT","SPEAK","MUTE_MEMBERS","DEAFEN_MEMBERS", "MOVE_MEMBERS","USE_VAD","CHANGE_NICKNAME","MANAGE_NICKNAMES","MANAGE_ROLES","MANAGE_WEBHOOKS","MANAGE_EMOJIS",
    ]
    if(cmd.permissions.length){
      let invalidPerms = [];
      for(const perm of cmd.permissions){
        if(!validPermissions.includes(perm)){
          return console.log(`Invalid permissions! ${invalidPerms}`);
        }
        if(!message.member.hasPermission(perm)){
          invalidPerms.push(perm);
          break;
        }
      }
      if(invalidPerms.length){
        return message.channel.send(`:no_entry:** Sorry, you don't have right permissions to use this command: \`${invalidPerms}\` **:no_entry:`);
      }
    }
    try{
      cmd.execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild,randomColor);
    } catch (error) {
      console.error(error);
      message.channel.send(`**This command doesn't exist!**`);
    }
});

bot.on('ready', () =>{
  console.log(`Ready to go! ${bot.user.tag}`);
  var used = false;
  setInterval( ()=>{
    if(used){
      bot.user.setActivity(`Type ${process.env.PREFIX}help or mobyhelp`, { type: `PLAYING` });
      used=false;
      }else{
      bot.user.setActivity(`Just vibin :D'`, { type: `PLAYING` });
      used=true;
      }
      if(used){
        bot.user.setActivity(`Invite me to your server!`, {
          type: `PLAYING`,
        });
      }else{
        bot.user.setActivity(`Help me by donating here on patreon :PP https://www.patreon.com/Mobybot`, {
          type: 'PLAYING',
        });
      }
  },10000)
});
bot.on('guildCreate', async(guild)=>{
  let guildData = await guildModel.findOne({guildID:guild.id});
  if(!guildData){
    let guildDat =  await guildModel.create({
      guildID: guild.id,
      countingCh:'counting',
      welcome:'welcome',
      departures:'departures',
    });
  guildDat.save();
  }

  const channel = guild.channels.cache.find(channel => channel.name === "general" || channel.name === "lounge" || channel.name === "main");
  if(!channel) channel = guild.channels.cache.find(channel => channel.type === "text");
  let greetingsEmbed = new Discord.MessageEmbed()
            .setTitle(`:chart_with_upwards_trend: Thank you for inviting me to your server!`)
            .setURL(bot.avatarURL)
            .setDescription(`
            :hand_splayed: Hi there!
            As you probably know my name is ${bot.user}. I can be quite useful!
            I feature things like: music player with queue system • economy system(in development) •
            and a bit of moderation or handy commands!
            `)
            .setColor(`#de0909`)
            .addFields(
                {name:`:guitar: Lets start by typing:`,value:`${process.env.PREFIX}help`,inline:false}
            )
            .setFooter(`You rock! • Thank you!`)
            .setTimestamp()
  channel.send(greetingsEmbed);
});
bot.on('guildDelete', async(guild)=>{
  await guildModel.findOneAndDelete({guildID:guild.id});
  await disabledModel.findOneAndDelete({guildID:guild.id});
  await countingModel.findOneAndDelete({guildID:guild.id});
});
bot.on('guildMemberAdd', async (guildMember) =>{
  let profileData = await profileModel.findOne({userID:guildMember.id});
    if(!profileData){
      let profile = await profileModel.create({
        userID: guildMember.id,
        serverID: guildMember.guild.id,
        coins: 100,
        bank: 0,
      });
      profile.save();
    }
    
    let guildData = await guildModel.findOne({guildID: guildMember.guild.id});
    const welcomeChannel = guildData.welcome;
    let welcomeName = guildMember.guild.channels.cache.find(channel => channel.name == welcomeChannel);
    if(!welcomeName){
      let welcomeId = guildMember.guild.channels.cache.find(channel => channel.id == welcomeChannel)
      if(!welcomeId) return;
      welcomeId.send(`:handshake: Welcome <@${guildMember.user.id}>! to the ${guildMember.guild.name}! :handshake:`)
      
    }else{
      welcomeName.send(`:handshake: Welcome <@${guildMember.user.id}>! to the ${guildMember.guild.name}! :handshake:`)
    }
    //MEMBER COUNTER
    if(guildData.memberCounter){
      let allMembers = guildMember.guild.memberCount.toLocaleString();
      let theChannelId = guildMember.guild.channels.cache.get(guildData.memberCounter);
      if(!theChannelId) return;
      theChannelId.setName(`Total members: ${allMembers}`);
    }
    //MEMBERCOUNTER
});
bot.on('guildMemberRemove', async (guildMember) =>{
  let guildData = await guildModel.findOne({guildID: guildMember.guild.id});
  if(!guildData) return;
  const departuresChannel = guildData.departures;
    let departuresName = guildMember.guild.channels.cache.find(channel => channel.name == departuresChannel);
    if(!departuresName){
      let departuresId = guildMember.guild.channels.cache.find(channel => channel.id == departuresChannel)
      if(!departuresId) return;
      departuresId.send(`:briefcase: ** <@${guildMember.user.id}> has departed from the server** :briefcase:`)
    }else{
      departuresName.send(`:briefcase: ** <@${guildMember.user.id}> has departed from the server** :briefcase:`)
    }
  
  //MEMBERCOUNTER
  
  if(guildData.memberCounter){
    let allMembers = guildMember.guild.memberCount.toLocaleString();
    let theChannelId = guildMember.guild.channels.cache.get(guildData.memberCounter);
    if(!theChannelId) return console.log('error');
    theChannelId.setName(`Total members: ${allMembers}`);
  }
  //MEMBERCOUNTER
});
bot.login(process.env.DISCORD_TOKEN);