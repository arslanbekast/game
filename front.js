import {Game} from './game.js';
import {EventEmitter} from './utils/observer/EventEmitter.js';
import {GameComponent} from './view.js';


const start = async () => {
    const eventEmitter = new EventEmitter()
    const game = new Game("name", eventEmitter); // di
    game.settings = {gridSize: {
        columnsCount: 4,
        rowsCount: 4,
        }}
    await game.start();

    const view = new GameComponent(game);

    view.render();

    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "ArrowUp":
                game.movePlayer1Up();
                break;
            case "ArrowDown":
                game.movePlayer1Down();
                break;
            case "ArrowRight":
                game.movePlayer1Right();
                break;
            case "ArrowLeft":
                game.movePlayer1Left();
                break;
        }
    });
    window.addEventListener('keydown', (e) => {

        switch (e.code) {
            case "KeyW":
                game.movePlayer2Up();
                break;
            case "KeyS":
                game.movePlayer2Down();
                break;
            case "KeyD":
                game.movePlayer2Right();
                break;
            case "KeyA":
                game.movePlayer2Left();
                break;
        }
    });
}



start();
