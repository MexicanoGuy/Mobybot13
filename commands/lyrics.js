const { execute } = require("./counting");

module.exports = {
    name:'lyrics',
    description:'You can use this command to search for the lyrics for the song!',
    aliases:['ly'],
    permissions:['SEND_MESSAGES'],

    async execute(message,args,commandName,bot,Discord,profileData,countingData,guildData,disabledData,guild,randomColor){
        const Genius = require(`genius-lyrics`); 
    const genius = new Genius.Client('HNtKX4SPeQJeiHipqcNV9qlm6AznyF_6WRe62HEXs8OvoE5p8farFTxsMnTOX2GA');
    let song = args.join(` `);
    let searches;
    if(!song) return message.channel.send(`**Please type the song name! **`)
        /*if(!song){
            if(!server_queue) return message.channel.send(`** There's nothing playing right now! **`)    
            var currentSong = JSON.stringify(server_queue.songs[0].title).replace(/[()"]+/g, '');
            let forbiddenList = ["(Official Video)"," Official Video","official","video","Video","OFFICIAL","MUSIC","VIDEO"];
            for(var i in forbiddenList){
                if(currentSong.includes(forbiddenList[i])) currentSong.replace(forbiddenList[i],'');
            }
            message.channel.send(currentSong);
            console.log(currentSong);*/
            
            //searches = await genius.songs.search(currentSong);
            //var lyrics = await searches[0].lyrics();
                //if(!lyrics) return message.channel.send(`**I couldn't find lyrics for \`${currentSong}\`! **`);
            //console.log(searches);
            
            
            /*let lyricsEmbed = new Discord.MessageEmbed()
            .setTitle(`Lyrics for the \`${currentSong}\``)
            .setDescription(lyrics)
            .setColor(`#0328fc`)
            .setTimestamp()
            message.channel.send(lyricsEmbed);*/
            
        //}
        //else{
            searches = await genius.songs.search(song);
            let lyrics = await searches[0].lyrics()
                if(!lyrics) return message.channel.send(`**I couldn't find lyrics for \`${song}\`! **`)
            
            let lyricsEmbed = new Discord.MessageEmbed()
            .setTitle(`Lyrics for the \` ${song}\``)
            .setDescription(lyrics)
            .setColor(`#0328fc`)
            .setTimestamp()
            message.channel.send(lyricsEmbed);
        //}
    }
}