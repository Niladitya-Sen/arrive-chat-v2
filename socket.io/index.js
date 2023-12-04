import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import sql from 'mssql';
import 'dotenv/config';
import gTTS from 'gtts';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const PORT = 3013;

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

async function translate(text, to) {
    const response = await fetch('https://ae.arrive.waysdatalabs.com/api/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, to })
    });
    const data = await response.json();

    return data.translated_text;
}

io.on("connection", (socket) => {
    socket.on("bot_chat", async ({ message, sessionId }) => {
        const response = await fetch('https://ae.arrive.waysdatalabs.com/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_input: message })
        });

        const data = await response.json();

        try {
            await sql.query`INSERT INTO bot_messages (sessionId, message, messagedBy, time) VALUES (${sessionId}, ${message}, 'customer', ${new Date().toLocaleTimeString(
                'en-US',
                { hour: 'numeric', minute: 'numeric', hour12: true },
            )}), (${sessionId}, ${data.response}, 'bot', ${new Date().toLocaleTimeString(
                'en-US',
                { hour: 'numeric', minute: 'numeric', hour12: true },
            )})`;
        } catch (err) {
            console.log(err);
        }

        socket.emit("bot_chat", {
            messages: [
                data.response
            ],
        })

    });

    socket.on("add-room-user", async ({ roomno, service }) => {
        /* console.log(roomno, service); */

        try {
            await sql.query`INSERT INTO services (room, service) VALUES (${roomno}, ${service})`;

            socket.broadcast.emit("add-room-captain", {
                roomno
            })
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("delete-room", async ({ roomno }) => {
        /* console.log(roomno); */

        try {
            await sql.query`DELETE FROM services WHERE room = ${roomno}`;
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("get-all-rooms-captain", async () => {
        const result = await sql.query("SELECT DISTINCT room FROM services");
        /* console.log(result.recordset) */

        socket.emit("get-all-rooms-captain", {
            rooms: result.recordset
        });
    });

    socket.on('join-room', ({ roomno }) => {
        /* console.log(roomno); */
        socket.join(roomno);
    });

    socket.on("send-message", async ({ roomno, message, messagedBy, language, time }) => {
        /*  console.log(roomno, message, messagedBy, language); */

        if (messagedBy === 'captain') {
            const result = await sql.query`SELECT language FROM customers c WHERE c.room_no = ${roomno}`;
            /* console.log(result.recordset); */
            const language = result.recordset[0].language;
            const translatedMessage = await translate(message, language);
            await sql.query`INSERT INTO messages_ (roomno, message, messagedBy, translated_customer, translated_captain, time) VALUES (${roomno}, ${message}, ${messagedBy}, ${translatedMessage}, ${message}, ${time})`;
            socket.to(roomno).emit("receive-message", {
                message: translatedMessage,
                messagedBy
            });
        } else if (messagedBy === 'customer') {
            socket.to(roomno).emit("get-captain-language", message)
        }
    });

    socket.on("captain-language", async ({ language, message, roomno }) => {
        /* console.log(language, message); */
        const translatedMessage = await translate(message, language);
        await sql.query`INSERT INTO messages_ (roomno, message, messagedBy, translated_customer, translated_captain, time) VALUES (${roomno}, ${message}, 'customer', ${message}, ${translatedMessage}, ${new Date().toLocaleTimeString(
            'en-US',
            { hour: 'numeric', minute: 'numeric', hour12: true },
        )})`;
        socket.emit("receive-message", {
            message: translatedMessage,
            messagedBy: 'customer'
        });
    });
});

app.get("/node-api/get-all-messages-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;
    const result_ = await sql.query`SELECT DISTINCT date FROM messages_ m WHERE m.roomno = ${roomno};`;
    const result = await sql.query`SELECT * FROM messages_ WHERE roomno = ${roomno}`;

    let arrangedResult = {};
    for (let element of result_.recordset) {
        arrangedResult[element.date] = result.recordset.filter((item) => item.date + "" === element.date + "");
    }

    res.json({
        success: true,
        messages: arrangedResult
    });
});

app.get("/node-api/get-services-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;

    try {
        const result = await sql.query`SELECT service FROM services WHERE room = ${roomno}`;
        /* console.log(result.recordset); */

        res.json({
            success: true,
            services: result.recordset
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/node-api/get-rooms-by-service/:service", async (req, res) => {
    const { service } = req.params;

    try {
        const result = await sql.query`SELECT room FROM services WHERE service = ${service}`;
        /* console.log(result.recordset); */

        res.json({
            success: true,
            rooms: result.recordset
        });
    } catch (err) {
        console.log(err);
    }
});

app.get("/node-api/get-speech/:message", (req, res) => {
    const { message } = req.params;
    const { language } = req.query;

    const langs = ['en', 'fr', 'ar', 'es', 'de', 'ru']

    if (langs.includes(language)) {
        const gtts = new gTTS(message, language ?? 'en');
        res.setHeader('Content-Type', 'audio/mpeg');
        gtts.stream().pipe(res);
    } else {
        res.json({
            success: false,
            message: "Language not supported"
        });
    }
});

app.post("/node-api/get-speech", (req, res) => {
    const { message } = req.body;
    const { language } = req.query;

    const langs = ['en', 'fr', 'ar', 'es', 'de', 'ru']

    if (langs.includes(language)) {
        const gtts = new gTTS(message, language ?? 'en');
        res.setHeader('Content-Type', 'audio/mpeg');
        gtts.stream().pipe(res);
    } else {
        res.json({
            success: false,
            message: "Language not supported"
        });
    }
});

app.get("/node-api/get-bot-messages-by-sessionId/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const result_ = await sql.query`SELECT DISTINCT date FROM bot_messages bm WHERE bm.sessionId = ${sessionId};`;
    const result = await sql.query`SELECT * FROM bot_messages WHERE sessionId = ${sessionId}`;

    let arrangedResult = {};
    for (let element of result_.recordset) {
        arrangedResult[element.date] = result.recordset.filter((item) => item.date + "" === element.date + "");
    }

    res.json({
        success: true,
        messages: arrangedResult
    });
});

app.get("/node-api/captain/get-captain", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    console.log(token, authorization);

    if (!token) return res.status(403).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { emp_id } = decoded;

    const result = await sql.query`SELECT name, employee_id, email, language, phoneno FROM captain WHERE employee_id = ${emp_id}`;

    res.json({
        success: true,
        captain: result.recordset[0]
    });
});

app.post("/node-api/captain/update-captain", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    console.log(token, authorization);

    if (!token) return res.status(403).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { emp_id } = decoded;

    console.log(req.body);

    const { name, employee_id, email, language, phoneno } = req.body;

    const result = await sql.query`UPDATE captain SET name = ${name}, email = ${email}, language = ${language}, phoneno = ${phoneno} WHERE employee_id = ${emp_id}`;

    res.json({
        success: true,
        message: "Captain updated successfully"
    });
});

server.listen(PORT, async () => {
    try {
        await sql.connect(process.env.DATABASE_URL);
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.log(err);
    }
});