import {EventsFactory, Game, GAME_MODES} from './game.js';
import {EventEmitter} from './utils/observer/EventEmitter.js';
import {GameView} from './view.js';
import {Controller1} from './controller1.js';
import {socket} from './front/ws.js';
import {WSAdapter} from './front/WSAdapter.js';


const start = async () => {
    const eventEmitter = new EventEmitter()
    const eventsFactory = new EventsFactory()
    const wsAdapter = new WSAdapter(socket)

    const game = new Game("name", eventEmitter, eventsFactory); // di
    game.settings = {gridSize: {
        columnsCount: 4,
        rowsCount: 4,
        },
        mode: GAME_MODES.CLIENT
    }
    await game.start();

    const controller = new Controller1(game, wsAdapter);
    const view = new GameView(controller, game);

    view.render();
}



start();


