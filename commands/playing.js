module.exports.run = (client, message, args) => {
    switch(args[0]){
        case 'p': //setting activity to "playing"
        if(message.member.roles.find(r => r.name === "Mods"))return message.channel.send('You cant do that')
        let word = args[1];
        client.user.setActivity(args.splice(1).join(' '), {type: 'playing'});
        message.channel.send(`status set to: **Playing ${word}**`);
        break;
        case 'w': //setting activity to "watching"
        if(message.member.roles.find(r => r.name === "Mods"))return message.channel.send('You cant do that')
        let word2 = args[1];
        client.user.setActivity(args.splice(1).join(' '), {type: 'watching'});
        message.channel.send(`status set to: **Watching ${word2}**`)
        break;
        case 'l': //setting activity to "listening"
        if(message.member.roles.find(r => r.name === "Mods"))return message.channel.send('You cant do that')
        let word3 = args[1];
        client.user.setActivity(args.splice(1).join(' '), {type: 'listening'});
        message.channel.send(`status set to: **Listening ${word3}**`);
        break;
        case 's': //setting activity to "listening"
        if(message.member.roles.find(r => r.name === "Mods"))return message.channel.send('You cant do that')
        let word4 = args[1];
        client.user.setActivity(args.splice(1).join(' '), {type: 'streaming'});
        message.channel.send(`status set to: **Streaming ${word4}**`);
        break;
    }
}
