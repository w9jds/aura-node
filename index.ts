import {initializeApp, credential, ServiceAccount} from 'firebase-admin';
import {Server, Request, ResponseToolkit} from 'hapi';
import * as cert from './config/neweden-admin.json';
import {Client} from 'discord.js';

import Bot from './bot';

const firebase = initializeApp({
    credential: credential.cert(cert as ServiceAccount),
    databaseURL: process.env.DATABASE_URL
});

const client = new Client();
const bot = new Bot(client, firebase.database());
const server: Server = new Server({
    port: process.env.PORT || 8000,
    host: '0.0.0.0'
});

async function init(): Promise<Server> {
    createHealthRoutes();

    await server.start();

    return server;
}

const createHealthRoutes = () => {
    server.route({
        method: 'GET',
        path: '/_status/healthz',
        handler: (request: Request, h: ResponseToolkit) => {
            return h.response();
        }
    });
}

init().then(server => {
    console.log('Server running at:', server.info.uri);
}).catch(error => {
    console.log(error);
});
