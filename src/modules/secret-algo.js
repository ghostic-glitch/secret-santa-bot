const fs = require('fs');

class SecretAlgo {

    constructor(client)
    {
        this._client = client;
        this._members = new Map();
        this._pairs = new Map();

        this._rumbled = false;
    }

    allMembers()
    {
        return new Promise((a) => {
            a(this._members);
        })
    }

    check()
    {
        return new Promise((a, d) => {
            if(this._members.size >= 2 && !this._rumbled)
                a(true);

            a(false);
        });
    }

    contain(id)
    {
        return this._members.has(id);
    }

    join(member, datas)
    {
        return new Promise((a, d) => {
            if(datas.preferences && datas.address && datas.id)
            {
                this._members.set(member.id, datas);
                a();
            }
            else
            {
                d("Problem ?")
            }
        });
    }

    rumble()
    {
        return new Promise((a, d) => {
            this.check().then(verify => {
                if(verify)
                {
                    let sender = Array.from(this._members.values());
                    let receiver = Array.from(this._members.values());

                    let result = {};
    
                    for(let i = 0; i < sender.length; i++)
                    {
                        let pick = receiver[Math.floor(Math.random() * receiver.length)];

                        while(sender[i].id === pick.id)
                            pick = receiver[Math.floor(Math.random() * receiver.length)]; 

                        this._pairs.set(sender[i].id, pick);

                        receiver.splice(receiver.indexOf(pick), 1);

                        result[sender[i].id] = pick;
                    }

                    this._rumbled = true;

                    fs.writeFileSync('rumble.json', JSON.stringify(result), 'utf-8');

                    a(this._pairs);
                }
                else
                    a('Erreur')
            });
        });
    }
}

module.exports = SecretAlgo;