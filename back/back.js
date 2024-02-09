import { WebSocketServer } from 'ws';
import {EventEmitter} from '../utils/observer/EventEmitter.js';
import {DIRECTIONS, EventsFactory, Game, GAME_MODES} from '../game.js';

const wss = new WebSocketServer({ port: 3000 });

const eventEmitter = new EventEmitter()
const eventsFactory = new EventsFactory()

const game = new Game("name", eventEmitter, eventsFactory); // di
game.settings = {gridSize: {
        columnsCount: 4,
        rowsCount: 4,
    },
    mode: GAME_MODES.SERVER
}

game.eventEmitter.subscribe('change', (e) => {
    connections.forEach((ws) => {
        ws.send(JSON.stringify(e));
    })
})


const connections = [];

wss.on('connection', async function connection(ws) {

    connections.push(ws);

    if (connections.length === 2) {
        await game.start()
        console.log("GAME STARTED ON THE SERVER")
    }

    ws.on('message', function message(data) {
       const command = JSON.parse(data);
        console.log("%s: ", data);
       if (command.commandType === 'MOVE-PLAYER') {

           const playerNumber = command.payload.playerNumber;

           switch (command.payload.direction) {
               case DIRECTIONS.UP:
                   game[`movePlayer${playerNumber}Up`]();
                   break;
               case DIRECTIONS.DOWN:
                   game[`movePlayer${playerNumber}Down`]();
                   break;
               case DIRECTIONS.RIGHT:
                   game[`movePlayer${playerNumber}Right`]();
                   break;
               case DIRECTIONS.LEFT:
                   game[`movePlayer${playerNumber}Left`]();
                   break;
           }
       }
    });
});
