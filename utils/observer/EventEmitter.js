export class EventEmitter {
    #subscribers = {
        //'eventName': [() =>{}, () =>{}]
    }

    addEventListener(eventName, observer) {
        return this.subscribe(eventName, observer);
    }

    on(eventName, observer) {
        return this.subscribe(eventName, observer);
    }

    #findAndRemoveSubscriber(eventName, observer) {
        this.#subscribers[eventName] = this.#subscribers[eventName]?.filter(subscriber => subscriber !== observer);
    }

    off(eventName, observer) {
        this.#findAndRemoveSubscriber(eventName, observer);
    }

    subscribe(eventName, observer) {
        if (!this.#subscribers[eventName]) {
            this.#subscribers[eventName] = [];
        }
        this.#subscribers[eventName].push(observer);
        return () => {
            this.#findAndRemoveSubscriber(eventName, observer);
        }
    }

    emit(eventName, data = null) {
        this.#subscribers[eventName]?.forEach(subscriber => {
            subscriber(data);
        });
    }
}
