export class Game {
    #settings = {
        pointsToWin: 10,
        gridSize: {
            columnsCount: 4,
            rowsCount: 4
        },
        googleJumpInterval: 2000
    }
    #status = 'pending';
    #score = {
        1: {points: 0},
        2: {points: 0}
    }
    #googleJumpInterval;
    #player1;
    #player2;
    #google;

    eventEmitter;

    constructor(name, eventEmitter) {
        this.name = name;
        this.eventEmitter = eventEmitter;
    }

    #getRandomPosition(notCrossedPositions = []) {
        let newX;
        let newY;

        do {
            newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnsCount - 1);
            newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1);
        }
        while (
            notCrossedPositions.some(p => newX === p.x && newY === p.y)
            )

        return new Position(newX, newY)
    }

    set settings(settings) {
        /*if (!settings.gridSize) {
            throw new Error('Incorrect settings object');
        }

        if (settings.gridSize.columnsCount * settings.gridSize.rowsCount < 3) {
            throw new Error('Cells count should be 3 and more. Increase columnsCount or rowsCount');
        }*/

        this.#settings = {
            ...this.#settings,
            ...settings
        }

        this.#settings.gridSize = settings.gridSize ? {
            ...this.#settings.gridSize,
            ...settings.gridSize
        } : this.#settings.gridSize
    }

    get settings() {
        return this.#settings;
    }

    get status() {
        return this.#status;
    }

    #createUnits() {
        const player1Position = this.#getRandomPosition([])
        this.#player1 = new Player(player1Position, 1);

        const player2Position = this.#getRandomPosition([player1Position]);
        this.#player2 = new Player(player2Position, 2);

        this.#google = new Google()
        this.#moveGoogleToRandomPosition(true)
    }

    async start() {
        if (this.#status === 'pending') {
            this.#createUnits();
            this.#status = 'in-progress';
            this.#runGoogleJumpInterval();
        }
    }

    #runGoogleJumpInterval() {
        this.#googleJumpInterval = setInterval(() => {
            this.#moveGoogleToRandomPosition();
        }, this.#settings.googleJumpInterval);
    }

    async stop() {
        clearInterval(this.#googleJumpInterval);
        this.#status = 'stopped';
    }

    async #finishGame() {
        clearInterval(this.#googleJumpInterval);
        this.#status = 'finished';
    }

    #moveGoogleToRandomPosition(excludeGoogle = false) {
        let notCrossedPositions = [
            this.#player1.position,
            this.#player2.position
        ];
        if (!excludeGoogle) {
            notCrossedPositions.push(this.#google.position)
        }
        const googlePosition = this.#getRandomPosition(notCrossedPositions);
        this.#google.position = googlePosition;
        this.eventEmitter.emit('change');
    }

    get players() {
        return [this.#player1.clone(), this.#player2.clone()]
    }

    get google() {
        return this.#google.clone();
    }

    get score() {
        return this.#score;
    }

    #canMoveOrOutOfBorders(player, delta) {
        const newPosition = player.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        if (newPosition.x < 0 || newPosition.x >= this.#settings.gridSize.columnsCount) return false;
        if (newPosition.y < 0 || newPosition.y >= this.#settings.gridSize.rowsCount) return false;

        return true;
    }

    #canMoveOrOtherPlayerBlocking(movingPlayer, otherPlayer, delta) {
        const newPosition = movingPlayer.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        return !otherPlayer.position.equal(newPosition);
    }

    #checkGoogleCatching(player) {
        if (player.position.equal(this.#google.position)) {
            this.#score[player.number].points++;

            if (this.#score[player.number].points === this.#settings.pointsToWin) {
                this.#finishGame();
            } else {
                clearInterval(this.#googleJumpInterval);
                this.#moveGoogleToRandomPosition();
                this.#runGoogleJumpInterval();
            }
        }
    }

    #movePlayer(player, otherPlayer, delta) {
        const canMove = this.#canMoveOrOutOfBorders(player, delta);
        if (!canMove) return;

        const canMoveOrOtherPlayer = this.#canMoveOrOtherPlayerBlocking(player, otherPlayer, delta);
        if (!canMoveOrOtherPlayer) return;

        if (delta.x) player.position = new Position(player.position.x + delta.x, player.position.y);
        if (delta.y) player.position = new Position(player.position.x, player.position.y + delta.y);

        this.#checkGoogleCatching(player);
        this.eventEmitter.emit('change');
    }

    movePlayer1Right() {
        let delta = {x: 1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Left() {
        let delta = {x: -1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Up() {
        let delta = {y: -1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Down() {
        let delta = {y: 1};
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer2Right() {
        let delta = {x: 1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Left() {
        let delta = {x: -1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Up() {
        let delta = {y: -1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Down() {
        let delta = {y: 1};
        this.#movePlayer(this.#player2, this.#player1, delta);
    }
}

class NumberUtil {
    /**
     *
     * @param min
     * @param max
     * @returns вернёт рандомное число от min до max включительно
     */
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// man1 === man2 (man1.id === man2.id)
// poisiton1 === position2 (pos1.x === pos2.x && pos1.y === pos2.y)

// value object
export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Position(this.x, this.y);
    }

    equal(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    #position;
    constructor(position) {
        this.#position = position;
    }

    get position() {
        return new Position(this.#position.x, this.#position.y)
    }
    set position(position) {
        this.#position = position;
    }
    clone() {
       return Object.assign(new this.constructor(), this, {position: this.#position.clone()});
    }
}

class Player extends Unit {
    constructor(position, number) {
        super(position)
        this.number = number;
    }
}

class Google extends Unit {
    constructor(position) {
        super(position)
    }
}


