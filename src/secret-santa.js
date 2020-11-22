const { Client } = require('discord.js');

let instance = ''; 
 
class SecretSanta {

    constructor()
    {
        this._client = new Client();

        this._client.on('message', this.onMessage)
                    .on('ready', this.onReady);

        this._instances = new Map();

        instance = this;
    }

    connect()
    {
        this._client.login(require('./../config.json').token).then(() => {
            console.log("[SecretSanta] BOT en cours de connexion...");
        });
    }

    onMessage(message)
    {
        if(message.content.startsWith('°'))
        {
            let command = message.content.split(' ')[0].slice(1);
            let args = message.content.split(' ').splice(1);

            if(command === 'ssanta')
            {
                switch(args[0])
                {
                    case 'init':
                        if(message.member.id === '301115695360376832')
                        {
                            if(instance._instances.get(message.guild.id))
                            {
                                //ALREADY EANBLED
                            }
                            else
                            {
                                let algo = new (require('./modules/secret-algo'))(instance);
                                instance._instances.set(message.guild.id, algo);
                                message.channel.send({"embed" : {
                                    description: '**Bienvenue dans ce Secret Santa !**\nPour participer au Secret Santa, vous devez exécuter la commande : `°ssanta join` et le BOT vous demandera en message privé vos préférences et votre adresse.\n\n**A noter :**\nToutes les données qui seront rentrées dans le BOT seront stockées uniquement sur l\'ordinateur de Nico / Ghostic et elles serviront uniquement pendant la phase d\'envois des colis si il y a le moindre couac. Une fois que tous le monde aura envoyé son colis, ces données seront imédiatement supprimées.\n\n\n',
                                    author: {
                                      name: 'Secret Santa',
                                      icon_url: 'https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg'
                                    },
                                    color: 0xff0000,
                                    fields: [
                                      {
                                        name: '**Liste des commandes disponible pour tous :**',
                                        value: '+ `°ssanta join` : Pour pouvoir participer au Secret Santa. \n+ `°ssanta list` : Pour afficher la liste des participants.',
                                        inline: true
                                      }
                                    ]
                                  }
                                });
                            }
                        }
                        else
                        {
                            //NO PERMISSION
                        }
                        break;

                    case 'join':
                        if(instance._instances.get(message.guild.id))
                        {
                            if(!instance._instances.get(message.guild.id).contain(message.member.id))
                            {
                                message.member.send({embed: {
                                    description: 'Pour pouvoir vous enregistrer dans le Secret Santa, je voudrais que vous me donnez vos préférences pour le cadeau.\n\nEcrivez-ici, et n\'écrivez pas dans le serveur, votre réponse ne sera pas lue.',
                                    author: {
                                      name: 'Secret Santa',
                                      icon_url: 'https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg'
                                    },
                                    color: 53380
                                }}).then((msg) => {
                                    let datas = {id: message.member.id};
                                    let f = m => m.author.id === message.member.id;
                                    msg.channel.awaitMessages(f, {max: 1, time: 60000}).then(collected => {
                                        datas.preferences = collected.first().content;
                                        msg.channel.send({embed: {
                                            description: 'Maintenant j\'aurais besoin de votre adresse ou adresse email s\'il vous plait.',
                                            author: {
                                              name: 'Secret Santa',
                                              icon_url: 'https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg'
                                            },
                                            color: 53380,
                                            fields: [
                                              {
                                                name: 'Saisissez votre adresse comme celà:',
                                                value: 'Prénom NOM\nN° Rue\n Code Postal - Ville',
                                              },
                                              {
                                                  name: 'Ou alors si vous préférez un cadeau virtuel, veuillez saisir une adresse email',
                                                  value: 'contact@monemail.com'
                                              }
                                            ]
                                        }}).then(msg2 => {
                                            let f2 = m => m.author.id === message.member.id;
                                            msg.channel.awaitMessages(f2, {max: 1, time: 60000}).then(collected2 => {
                                                datas.address = collected2.first().content;
                                                msg.channel.send({
                                                    embed: {
                                                        description: 'Confirmez-vous ces données-ci ?',
                                                        fields: [
                                                            {
                                                                name: 'Adreesse :',
                                                                value: datas.address
                                                            },
                                                            {
                                                                name: 'Préférences :',
                                                                value: datas.preferences
                                                            },
                                                            {
                                                                name: 'Pour confirmer votre participation :',
                                                                value: "Écrivez ici `yes`"
                                                            }
                                                        ],
                                                        author: {
                                                          name: 'Secret Santa',
                                                          icon_url: 'https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg'
                                                        },
                                                        color: 53380
                                                    }
                                                }).then(() => {
                                                    let f3 = m => m.author.id === message.member.id;
                                                    msg.channel.awaitMessages(f3, {max: 1, time: 60000}).then(collected3 => {
                                                        if(collected3.first().content.toLowerCase() === 'yes')
                                                        {
                                                            instance._instances.get(message.guild.id).join(message.member, datas).then(() => {
                                                                message.channel.send(`**${message.member}** a rejoint le Secret Santa !`);
                                                                msg.channel.send({embed: {
                                                                        description: 'Vous avez été enregistrer correctement dans le Secret Santa !\nVous pouvez fermer cette conversation.',
                                                                        author: {
                                                                            name: 'Secret Santa',
                                                                            icon_url: 'https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg'
                                                                        },
                                                                        color: 53380
                                                                  }});
                                                            }).catch(console.error);
                                                        }
                                                    }).catch();
                                                });
                                            }) 
                                        });
                                    })
                                }).catch(err => {
                                    if(err.code === 50007)
                                    {
                                        message.reply("Vos MPs ne sont pas ouvert à tous, veuillez les ouvrir pour pouvoir rejoindre le Secret Santa.");
                                    }
                                });
                            }
                            else
                            {
                                //ALREADY IN
                            }
                        }
                        else
                        {
                        }
                        break;

                    case 'list':
                        if(instance._instances.get(message.guild.id))
                        {
                            let promises = [];
                            instance._instances.get(message.guild.id).allMembers().then((members) => {
                                
                                members.forEach(element => {
                                    promises.push(instance._client.users.fetch(element.id));
                                });


                                Promise.all(promises).then(values => {

                                    let list = '\n';

                                    for(let i = 0; i < values.length; i++)
                                        list += values[i].username + ' \n';

                                    message.channel.send("Voici la liste des membres inscrit dans le Secret Santa :" + list);

                                });
                            });
                        }
                        else
                        {
                            message.channel.send({
                                description: 'Le Secret Santa n\'est pas encore lancé ! Attendez que Nico\' ait enclenché le Secret Santa ici !',
                                author: {
                                  name: 'Secret Santa',
                                  icon_url: 'https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg'
                                },
                                color: 15406156,
                                fields: [
                                  {
                                    name: '',
                                    value: '',
                                    inline: true
                                  }
                                ]
                            });
                        }
                        break;

                    case 'rumble':
                        if(message.member.id === '211956246180265984')
                        {
                            if(instance._instances.get(message.guild.id))
                            {
                                instance._instances.get(message.guild.id).rumble().then(pairs => {
                                    let members = Array.from(pairs.keys());
                                    members.forEach(member => {
                                        let datas = pairs.get(member);
                                        message.guild.members.cache.get(member).send({embed:{
                                            "description": `Votre cible à l'issus de ce Secret Santa est : \`${message.guild.members.cache.get(datas.id).user.tag}\`.\n\n`,
                                            "author": {
                                              "name": "Secret Santa",
                                              "icon_url": "https://image.freepik.com/free-vector/cute-christmas-background-with-santa-claus-elements_1057-2305.jpg"
                                            },
                                            "color": 53380,
                                            "fields": [
                                              {
                                                "name": "Ses préférences :",
                                                "value": `${datas.preferences}`,
                                              },
                                              {
                                                "name": "Son addresse :",
                                                "value": `${datas.address}`, 
                                              },
                                              {
                                                  "name": "Précisions :",
                                                  "value": "Ne divulguez aucune informations privés à qui que ce soit !"
                                              }
                                            ]
                                        }})
                                    });
                                });
                            }   
                            else
                            {

                            }
                        }
                        else
                        {

                        }
                        break;
                }
            }
        }
    }

    onReady()
    {
        console.log("[SecretSanta] BOT connecté !");
        console.log(`https://discord.com/oauth2/authorize?client_id=${instance._client.user.id}&scope=bot&permissions=268561464`)
    }
}

module.exports = new SecretSanta();