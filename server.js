const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true});
const botconfig = require('./botconfig.json');
const fs = require('fs');
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  
  if(err) console.log(err);
  
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands!");
    return;
  }
  
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
    
  });
  
});
const http = require('http');
const express = require('express');
const app = express();

app.listen(8080);
setInterval(() => {
http.get(`http://styx.glitch.me/`);      //if you are running this on glitch.com put your projects domain name in the spot or the domain
}, 300000);

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} server(s)!`);
  
const activities_list = [
    "test", //this needs to be here. it doesn't show in the status tho.
    "test",
    "In " + bot.guilds.size + " servers",
    "With " + bot.users.size + " users"
    ]; // creates an arraylist containing phrases you want your bot to switch through.

    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        bot.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 5000); // Runs this every 10 seconds.
});

bot.on("message", async message => {
  
  if(message.author.bot) return;
  
  let prefix = botconfig.prefix;
  
  if(!message.content.startsWith(prefix)) return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(prefix.length);
  
  let commandFile = bot.commands.get(cmd.slice(prefix.length));
  if(commandFile) commandFile.run(bot,message,args);
  
});

bot.login(process.env.TOKEN)
