import { io } from "socket.io-client";

const socket = io("http://localhost:3013", {
    autoConnect: false
});

export default socket;

// http://localhost:3013

// https://ae.arrive.waysdatalabs.com