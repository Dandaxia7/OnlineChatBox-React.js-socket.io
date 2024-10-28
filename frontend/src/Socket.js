import socketIOClient from 'socket.io-client';

const ENDPOINT = window.location.host.indexOf('localhost') >= 0 
    ? "http://127.0.0.1:4000"
    : window.location.host;

const socket = socketIOClient(ENDPOINT);

export default socket;