import { WebSocketServer } from "ws";

const roomWss = new WebSocketServer({ noServer: true })

roomWss.on("connection", (ws) => {
    ws.send("Hello from room ws server!")
})

export {
    roomWss
}