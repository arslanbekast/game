// Создаем новый экземпляр WebSocket, указывая URL вебсокет сервера

export const socket = new WebSocket('ws://localhost:3000');

// Обработчик, вызываемый при успешном соединении
socket.onopen = function(event) {
};

