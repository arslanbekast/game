export class GameComponent {
    #tableElement;
    #resultsElement;
    #game;

    constructor(game) {
        this.#game = game;
        this.#tableElement = document.getElementById('game-grid')
        this.#resultsElement = document.getElementById('results')

        game.eventEmitter.on('change', () => {
            this.render();
        })
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
    }
}
