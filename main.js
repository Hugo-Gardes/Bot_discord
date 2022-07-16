const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES], fetchAllMembers: true});
const fetch = require('node-fetch');
const dotenv = require('dotenv');
var rm_you_forgot = true;

dotenv.config();

client.on('ready', () => {
    const Guilds = client.guilds.cache.map(guild => guild.id);
    console.log(`Link start !`);
});

function replace_char(index, str, char)
{
    if (index > str.length - 1) {
        return (str);
    }
    return (str.substring(0, index)) + char + str.substring(index + 1);
}

function random_color()
{
    let color = "#000000";
    let hexa = "0123456789abcdef"
    for (i = 1; i < color.length; i++) {
        let rdm = Math.random() * hexa.length;
        let char = hexa[Math.floor(rdm)]
        color = replace_char(i, color, char);
    }
    return (color);
}

async function check_gif(msg, conten) {
    if (conten[0] === "!gif") {
        let ment = msg.mentions.users.first();
        let keyword = (ment !== null) ? conten.slice(1, conten.length).join(" ").replace("<@!" + ment + ">", "").replace(/[^a-zA-Z ]/g, "") : conten.slice(1, conten.length).join(" ").replace(/[^a-zA-Z]/g, "");
        if (ment != null) {
            ment = ment.toString().replace("<@", "").replace(">", "");
        }
        const url = `https://api.tenor.com/v1/search?q=${keyword}&key=TFVVS86I87FI`;
        const response = await fetch(url);
        const result = await response.json();
        if (result.results.length < 10) {
            msg.channel.send(`no gif found${(keyword != null) ? " for " + keyword : ""}`);
            return;
        }
        const index = Math.floor(Math.random() * result.results.length);
        const embed = new Discord.MessageEmbed()
            .setColor(random_color())
            .setFooter("i hate chapeau chapeau")
            .setTitle((ment == null) ? `here's your gif${(conten.length != 1) ? " " + keyword: ""} enjoy` : `${msg.author.username} send you this gif`)
            .setImage(result.results[index].media[0].gif.url);
        if (ment == null) {
            msg.channel.send({embeds:[embed]});
        } else {
            client.users.cache.get(ment).send({embeds:[embed]});
        }
            ;
        return (true);
    }
    return (false);
}

client.on('messageCreate', (msg) => {
    var conten = msg.content.split(" ");
    var check = false;
    var put = null;
    check = check_gif(msg, conten)
    if (conten[0] === "!help") {
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Help')
        .addFields(
            {name:'a^^', value:'remove all ^^'},
            {name:'ping', value:'send pong'},
            {name:'!gif [arg] [user]', value:'send a random gif'},
            {name:'!rmforgot', value:'remove message \"You forgot ^^\"'}
        )
        .setFooter('don\'t forgot you must hate ^^');
        if (embed == null) {
            exit(84);
        }
        put = { embeds: [embed] };
        check = true;
    }
    if (msg.channel.name == "karuta") {
        if (msg.author.username == "Mudae" || msg.author.username == "Mudae ^^") {
            msg.delete();
        }
    }
    if (conten[0] === "!rmforgot") {
        rm_you_forgot = (rm_you_forgot === true) ? false : true;
        if (rm_you_forgot === true) {
            put = `${msg.author.toString()} you disable "You forgot ^^" on this server`;
        } else {
            put = `${msg.author.toString()} you enable "You forgot ^^" on this server`;
        }
        check = true;
    }
    if (conten[0] === "ping") {
        msg.channel.send("pong");
    }
    if (conten[0] === "a^^") {
        var gu = client.guilds.cache.get(msg.guildId.toString());
        console.log('------------------------------------------------------');
        console.log('all characters nickname');
        console.log('------------------------------------------------------');
        gu.members.cache.forEach(data => {
            if (data.id != gu.ownerId) {
                data.setNickname((data.displayName.replace("^^", "") != null) ? data.displayName.replace("^^", "") : "(null)");
                console.log("nickname == " + (data.nickname !== null) ? (data.displayName.replace("^^", "") != null) ? data.displayName.replace("^^", "") : "(null)" : data.displayName);
            }
        });
        console.log('------------------------------------------------------');
        check = true;
        put = `${msg.author.toString()} all ^^ has been removed`
    }
    if (msg.content === "You forgot ^^" && rm_you_forgot === true) {
        msg.delete();
    }
    if (check === true) {
        msg.delete();
        if (put != null)
            msg.channel.send(put)
        check = false;
        put = null;
    }
});

if(client.login('') == false) {
    console.log(`login failed`);
}