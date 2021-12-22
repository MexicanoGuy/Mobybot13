const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const prefix = process.env.PREFIX;
const queue = new Map();
module.exports = {
    name: 'play',
    aliases: ['skip','next','stop','queue','pause','skipto','resume','loop','volume','vol','v','p'],
    description: `This command allows you to play a song, make a queue with songs, skip the songs using ${prefix}skip or ${prefix}next, or to ${prefix}stop the queue`,
    permissions:["SPEAK","CONNECT"],
    cooldown:'2',
    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild,randomColor){
        const voice_channel = message.member.voice.channel;
        const server_queue = queue.get(message.guild.id);
        
        let queue_constructor = {
            voice_channel: voice_channel,
            text_channel: message.channel,
            connection: null,
            songs: [],
            isLooped: false,
            dispatcherVolume: 1,
            counter: 1,
        }
        let song = {};
        if (commandName === 'play' || commandName === "p"){
            if (!voice_channel) return message.channel.send(':loud_sound: **You need to be in a channel to execute this command!** :loud_sound:');
            if (!args.length) return message.channel.send(':pencil2: **You need to type thesearch keyword!** :pencil2:');
            
            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            }
            else {
                    const video_finder = async (query) =>{
                        const video_result = await ytSearch(query);
                        return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                    }
                    const video = await video_finder(args.join(' '));
                    if (video){
                        song = { title: video.title, url: video.url } 
                    }else {
                        return message.channel.send(':interrobang: **There was some error finding video** :interrobang: ');
                    }
            }
            
            if (!server_queue){
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);   
                try {
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], message);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send(':tools: **There was an error connecting!** :tools:');
                    throw err;
                }
            } else{
                server_queue.songs.push(song);
                message.channel.send(`:musical_keyboard:  ***${song.title}*** **added to queue!** :musical_keyboard:`);
            }
        }
        if(commandName === 'skip') skip_song(message, server_queue);
        if(commandName === 'next') skip_song(message, server_queue);

        if(commandName === 'stop') stop_song(message, server_queue);
        if(commandName === 'pause') pause_song(message, server_queue);
        if(commandName === 'resume') resume_song(message, server_queue);
        
        if(commandName === 'volume') volume_of_player(message, server_queue, args);
        if(commandName === 'vol') volume_of_player(message, server_queue, args);
        if(commandName === 'v') volume_of_player(message, server_queue, args);
        
        if(commandName === 'queue') current_server_queue(message, server_queue);
        if(commandName === 'loop') loop_song(message, server_queue, voice_channel);
        if(commandName === 'skipto') skip_to(message, server_queue, args, queue_constructor.songs[0], voice_channel);

        bot.on('voiceStateUpdate', async(oldState,newState)=>{
            if(oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
            if(newState.id !== bot.user.id) return;
              console.log(`Destroyed the queue, because i was kicked from the VC!`);
              isLooped = false;
              queue.delete(oldState.guild.id);
          });
    }
}
const loop_song = async(message, server_queue, voice_channel) =>{
    if(!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
    if(!server_queue) return message.channel.send(`:notepad_spiral: ***There are no songs in the queue*** :notepad_spiral:`);
    if(server_queue.isLooped == false){
        server_queue.isLooped = true;
        return message.channel.send(`** Song has been looped! **`)
    }else{
        server_queue.isLooped = false;
        return message.channel.send(`** Song has been unlooped! **`)
    }
}

const skip_to = async (message, server_queue, args, song, voice_channel) => {
    if(!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
    if(!server_queue) return message.channel.send(`:notepad_spiral: ***There are no songs in the queue*** :notepad_spiral:`);
    
    let {guild} = message;
    const song_queue = queue.get(guild.id);
    const stream = ytdl(song.url, { filter: 'audioonly' });
    
    if(!args[0] && !Number.isInteger(args[0])) return message.channel.send(`**Please specify the number where to skip(in seconds) **`);
    //if(args[0] > server_queue.songs[0]) return
        song_queue.connection.play(stream, { seek: Number.parseInt(args[0]), volume: dispatcherVolume});

    return message.channel.send(`** *${JSON.stringify(server_queue.songs[0].title) }* has been skipped to: ${args[0]}**`);
}

const video_player = async (guild, song, message) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
            song_queue.voice_channel.leave();
            queue.delete(guild.id);
            return;  
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: song_queue.dispatcherVolume })
    .on('finish', () => {
            if(song_queue.counter!=5){
                if(song_queue.isLooped){
                    video_player(guild, song_queue.songs[0], message);
                }else{
                    song_queue.songs.shift();
                    video_player(guild, song_queue.songs[0], message);
                }
                song_queue.counter++;
            }else{
                message.channel.send(`**Song can be looped only 5 times! **`);
                song_queue.isLooped = false;
                song_queue.counter = 1;
                song_queue.songs.shift();
                video_player(guild, song_queue.songs[0]);
                
            }
    });
    if(song_queue.isLooped == false){
        await song_queue.text_channel.send(`:cd: Now playing: ***${song.title}*** :cd:`);
    }
    
}
const skip_song = (message, server_queue) => {
    if(!server_queue) return message.channel.send(`:notepad_spiral: ***There are no songs in the queue*** :notepad_spiral:`);
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if(!server_queue){
        return message.channel.send(`:notepad_spiral: ***There are no songs in the queue*** :notepad_spiral:`);
    }
    server_queue.connection.dispatcher.end();
}
const stop_song = (message, server_queue) => {
    if(!server_queue) return message.channel.send(`:notepad_spiral: ***There are no songs in the queue*** :notepad_spiral:`);
    if (!message.member.voice.channel) return message.channel.send(':loud_sound: **You need to be in a channel to execute this command!** :loud_sound:');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}
const pause_song = (message, server_queue) => {
    if(!server_queue) return message.channel.send(`:notepad_spiral: ***There are no songs in the queue*** :notepad_spiral:`);
    if (!message.member.voice.channel) return message.channel.send(':loud_sound: **You need to be in a channel to execute this command!** :loud_sound:');
    try{
        server_queue.connection.dispatcher.pause();
        message.channel.send(`**The queue has been paused! **`);
    }catch(err){
        message.channel.send(`:question: **There was an error** :question:`);
    }
    
    
}
const resume_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send(':loud_sound: **You need to be in a channel to execute this command!** :loud_sound:');
    try{
        server_queue.connection.dispatcher.resume();
        message.channel.send(`**The queue has been resumed! **`);
    }catch(err){
        message.channel.send(`:question: **There was an error** :question:`);
    }
    
}
const volume_of_player = (message, server_queue, args) => {
    if(!message.member.voice.channel) return message.channel.send(':loud_sound: **You need to be in a channel to execute this command!** :loud_sound:');
    if(!args[0]) return message.channel.send(`**You need to provide the number to change the volume**`);
    if(isNaN(args[0])) return message.channel.send(`You didn't provide any number!`);
    if(args[0]>51) return message.channel.send(`**Your number is too high to set a new volume level**`);
    try{
        server_queue.connection.dispatcher.setVolume(args[0]);
        message.channel.send(`**The volume has been set to: \`${args[0]}\` **`);
    }catch(err){
        message.channel.send(`:question: **There was an error** :question:`);
        console.log(err);
    }
}
const current_server_queue = (message, server_queue) => {
    if(!message.member.voice.channel) return message.channel.send(':loud_sound: **You need to be in a channel to execute this command!** :loud_sound:');
    if(server_queue){
        let queueMessage = `**:cd: Current queue is: :cd:\n`;
        for(var i=0; i<server_queue.songs.length; i++){
            queueMessage += `:black_small_square: Song number: \`${i+1}\` - *${JSON.stringify(server_queue.songs[i].title)}*\n`;
        }
        queueMessage += `**`
        message.channel.send(queueMessage);
    }else return message.channel.send(`:notepad_spiral: **There are no songs playing!** :notepad_spiral:`)
}