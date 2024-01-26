const {Game, Position} = require('./game');

describe('game tests', () => {
    let game;

    beforeEach(() => {
        game = new Game(1);
    })

    afterEach(async () => {
        await game.stop();
    })

    it('settings test', () => {
        // setter
        game.settings = {
            gridSize: {
                columnsCount: 4,
                rowsCount: 5
            }
        }

        // getter
        const settings = game.settings;

        expect(settings.gridSize.columnsCount).toBe(4);
        expect(settings.gridSize.rowsCount).toBe(5);
    })

    it('start game', async () => {
        // setter
        game.settings = {
            gridSize: {
                columnsCount: 4,
                rowsCount: 5
            }
        }

        expect(game.status).toBe('pending');
        await game.start();
        expect(game.status).toBe('in-progress');
    })

    it('check player init positions', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game();
            // setter
            game.settings = {
                gridSize: {
                    columnsCount: 1,
                    rowsCount: 3
                }
            }

            await game.start();

            expect([0]).toContain(game.players[0].position.x);
            expect([0, 1, 2]).toContain(game.players[0].position.y);

            expect([0]).toContain(game.players[1].position.x);
            expect([0, 1, 2]).toContain(game.players[1].position.y);

            expect(
                game.players[0].position.x !== game.players[1].position.x ||
                game.players[0].position.y !== game.players[1].position.y
            ).toBe(true);
            game.stop();
        }
    })

    it('check google init positions', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game();
            // setter
            game.settings = {
                gridSize: {
                    columnsCount: 1,
                    rowsCount: 3
                }
            }

            await game.start();

            expect([0]).toContain(game.google.position.x);
            expect([0, 1, 2]).toContain(game.google.position.y);

            expect(
                (game.google.position.x !== game.players[0].position.x ||
                    game.google.position.y !== game.players[0].position.y) &&
                (game.google.position.x !== game.players[1].position.x ||
                    game.google.position.y !== game.players[1].position.y)
            ).toBe(true);
            game.stop()
        }
    })

    it('catch google by player1 or player2 for one row', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game();
            // setter
            game.settings = {
                gridSize: {
                    columnsCount: 3,
                    rowsCount: 1
                }
            }

            await game.start();
            // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
            const deltaForPlayer1 = game.google.position.x - game.players[0].position.x;

            const prevGooglePosition = game.google.position.clone();

            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.google.position.x - game.players[1].position.x;
                if (deltaForPlayer2 > 0) game.movePlayer2Right();
                else game.movePlayer2Left();

                expect(game.score[1].points).toBe(0);
                expect(game.score[2].points).toBe(1);
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1Right();
                else game.movePlayer1Left();

                expect(game.score[1].points).toBe(1);
                expect(game.score[2].points).toBe(0);
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.stop();
        }
    })

    it('catch google by player1 or player2 for one column', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game();
            // setter
            game.settings = {
                gridSize: {
                    columnsCount: 1,
                    rowsCount: 3
                }
            }

            await game.start();
            // p1   p1  p2  p2  g   g
            // p2   g   p1  g   p1  p2
            // g    p2  g   p1  p2  p1
            const deltaForPlayer1 = game.google.position.y - game.players[0].position.y;

            const prevGooglePosition = game.google.position.clone();

            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.google.position.y - game.players[1].position.y;
                if (deltaForPlayer2 > 0) game.movePlayer2Down();
                else game.movePlayer2Up();

                expect(game.score[1].points).toBe(0);
                expect(game.score[2].points).toBe(1);
            } else {
                if (deltaForPlayer1 > 0) game.movePlayer1Down();
                else game.movePlayer1Up();

                expect(game.score[1].points).toBe(1);
                expect(game.score[2].points).toBe(0);
            }

            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.stop();
        }
    })

    it('check google positions after jump', async () => {
        // setter
        game.settings = {
            gridSize: {
                columnsCount: 1,
                rowsCount: 4,
            },
            googleJumpInterval: 100
        }

        await game.start();

        const prevPositions = game.google.position.clone();

        await sleep(150);

        expect(game.google.position.equal(prevPositions)).toBe(false);
    })


    it('one of two players should win', async () => {
        // setter
        game.settings = {
            pointsToWin: 3,
            gridSize: {
                columnsCount: 3,
                rowsCount: 1
            }
        }

        await game.start();
        // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
        const deltaForPlayer1 = game.google.position.x - game.players[0].position.x;
        if (Math.abs(deltaForPlayer1) === 2) {
            const deltaForPlayer2 = game.google.position.x - game.players[1].position.x;
            if (deltaForPlayer2 > 0) {
                game.movePlayer2Right();
                game.movePlayer2Left();
                game.movePlayer2Right();
            }
            else {
                game.movePlayer2Left();
                game.movePlayer2Right();
                game.movePlayer2Left();
            }

            expect(game.score[1].points).toBe(0);
            expect(game.score[2].points).toBe(3);
        } else {
            if (deltaForPlayer1 > 0) {
                game.movePlayer1Right();
                game.movePlayer1Left();
                game.movePlayer1Right();
            }
            else {
                game.movePlayer1Left();
                game.movePlayer1Right();
                game.movePlayer1Left();
            }
            expect(game.score[1].points).toBe(3);
            expect(game.score[2].points).toBe(0);
        }
        expect(game.status).toBe('finished');
    })

    it(`position shouldn't be changed`, async () => {
        await game.start();

        const player = game.players[0];
        const google = game.google;

        const prevX = player.position.x;

        player.position = new Position(100, 100);

        expect(game.players[0].position.x).toBe(prevX);
    })

})


const sleep = ms => new Promise((res) => setTimeout(res, ms));
