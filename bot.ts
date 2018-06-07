import {format} from 'date-fns';
import {database} from 'firebase-admin';
import {BotToken} from './config/config';
import {Client, GuildMember, Message} from 'discord.js';

export default class Bot {

    constructor(private client: Client, private firebase: database.Database) {
        this.registerListeners();
        this.client.login(BotToken);
    }

    private registerListeners = () => {
        this.client.on('ready', this.onReady);
        this.client.on('guildMemberAdd', this.onMemberAdded);
        this.client.on('message', this.processMessage);
    }

    private onReady = async (): Promise<void> => {
        console.log('Aura has started! All systems green.');
    }

    private onMemberAdded = async (member: GuildMember): Promise<void> => {
        let snapshot: database.DataSnapshot = await this.firebase.ref(`discord/${member.id}`).once('value');

        if (!snapshot.exists()) {
            // find the role we are looking for on the server the user just joined
            let guest = member.guild.roles.find(role => role.name == 'Guest');
            // set the users roles to just that role (Note, this removes all other roles)
            await member.setRoles([guest]);

            console.log(`Welcome to ${member.nickname}`);
        }
    }

    private processMessage = async (message: Message) => {
        if (message.author.bot) return;

        if (message.content.indexOf('!') !== 0) return;

        const args = message.content.slice(1).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (command === 'time') {
            const date = new Date(Date.now());
            const utc = new Date(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds()
            );

            message.channel.send(format(utc, 'dddd, DD MMM, YYYY HH:mm:ss'));
        }
    }
}
