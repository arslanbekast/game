import {DIRECTIONS} from './game.js';

export class GameView {
    #tableElement;
    #resultsElement;
    #game;
    #controller;
    #unbindEventListeners = null;

    constructor(controller, game) {
        this.#game = game;
        this.#controller = controller;
        this.#tableElement = document.getElementById('game-grid')
        this.#resultsElement = document.getElementById('results')

        game.eventEmitter.on('change', (event) => {
            this.render();
        })
    }

    #bindEventListeners() {
        if (this.#unbindEventListeners !== null) {
            this.#unbindEventListeners();
        }

        const handlers = {
            "ArrowUp": () => this.#controller.movePlayer(DIRECTIONS.UP, 1),
            "ArrowDown": () => this.#controller.movePlayer(DIRECTIONS.DOWN, 1),
            "ArrowRight": () => this.#controller.movePlayer(DIRECTIONS.RIGHT, 1),
            "ArrowLeft": () => this.#controller.movePlayer(DIRECTIONS.LEFT, 1),

            "KeyW": () =>  this.#controller.movePlayer(DIRECTIONS.UP, 2),
            "KeyS": () => this.#controller.movePlayer(DIRECTIONS.DOWN, 2),
            "KeyD": () => this.#controller.movePlayer(DIRECTIONS.RIGHT, 2),
            "KeyA": () => this.#controller.movePlayer(DIRECTIONS.LEFT, 2)
        }

        let bindPlayerControls = (e) => {
            const handler = handlers[e.code];
            if (handler) {
                handler();
            }
        };
        window.addEventListener('keydown', bindPlayerControls);

        this.#unbindEventListeners = () => {
            window.removeEventListener('keydown', bindPlayerControls)
        }
    }

    render() {
        this.#tableElement.innerHTML = '';
        this.#resultsElement.innerHTML = '';

        this.#resultsElement.append(`player1: ${this.#game.score['1'].points}; player2: ${this.#game.score['2'].points}; `)

        for (let y = 0; y < this.#game.settings.gridSize.rowsCount; y++) {
            const trElement = document.createElement('tr');

            for (let x = 0; x < this.#game.settings.gridSize.columnsCount; x++) {
                const tdElement = document.createElement('td');

                if (this.#game.players[0].position.x === x && this.#game.players[0].position.y === y) {
                    const imgElement = document.createElement('img');
                    imgElement.src = './assets/player1.png';
                    tdElement.append(imgElement);
                }

                if (this.#game.players[1].position.x === x && this.#game.players[1].position.y === y) {
                    const imgElement = document.createElement('img');
                    imgElement.src = './assets/player2.png';
                    tdElement.append(imgElement);
                }

                if (this.#game.google.position.x === x && this.#game.google.position.y === y) {
                    const imgElement = document.createElement('img');
                    imgElement.src = './assets/google.webp';
                    tdElement.append(imgElement);
                }

                trElement.append(tdElement);
            }

            this.#tableElement.append(trElement);
        }


        this.#bindEventListeners();
    }
}
