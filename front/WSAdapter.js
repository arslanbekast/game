import {EventEmitter} from '../utils/observer/EventEmitter.js';
import {socket} from './ws.js';

export class WSAdapter extends EventEmitter {
    #socket

    constructor(socket) {
        super()
        this.#socket = socket;

        socket.onmessage = (e) => {
            const event = JSON.parse(e.data);
            this.emit('new-message', event)
        };
    }

    send(data) {
        socket.send(JSON.stringify(data));
    }


}
