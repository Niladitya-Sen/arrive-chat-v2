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
        try {
            const result = await sql.query`SELECT * FROM services WHERE room = ${roomno} AND service = ${service}`;

            if (result.recordset.length === 0) {
                await sql.query`INSERT INTO services (room, service) VALUES (${roomno}, ${service})`;

                socket.broadcast.emit("add-room-captain", {
                    roomno
                })
            }

        } catch (err) {
            console.log(err);
        }
    });

    socket.on("add-support-user", async ({ sessionId }) => {
        /* console.log(sessionId); */
        try {
            const result = await sql.query`SELECT customerName FROM support WHERE sessionId = ${sessionId}`;
            console.log(result.recordset, sessionId);
            if (result.recordset.length > 0) {
                socket.broadcast.emit("add-support-captain", {
                    sessionId,
                    customerName: result.recordset[0].customerName
                })
            }
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

    socket.on("delete-support", async ({ roomno }) => {
        /* console.log(roomno); */

        try {
            await sql.query`DELETE FROM support WHERE sessionId = ${roomno}`;
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

    socket.on("get-all-support-captain", async () => {
        const result = await sql.query("SELECT DISTINCT sessionId, customerName FROM support");
        /* console.log(result.recordset) */

        socket.emit("get-all-support-captain", {
            rooms: result.recordset
        });
    });

    socket.on('join-room', ({ roomno }) => {
        /* console.log(roomno); */
        socket.join(roomno);
    });

    socket.on("send-message", async ({ roomno, message, messagedBy, language, time, type, sessionId }) => {
        /* console.log(roomno, message, messagedBy, language, time, type, sessionId); */
        if (messagedBy === 'captain') {
            const result = await sql.query`SELECT language FROM customers c WHERE c.room_no = ${roomno}`;
            /* console.log(result.recordset); */
            /* const language = result.recordset[0].language ?? 'en'; */
            const translatedMessage = await translate(message, language);
            if (type === 'cico') {
                await sql.query`INSERT INTO messages_ (message, messagedBy, translated_customer, translated_captain, time, isRead, type, sessionId) VALUES (${message}, ${messagedBy}, ${translatedMessage}, ${message}, ${time}, 0, 'cico', ${sessionId})`;
                socket.to(sessionId).emit("receive-message", {
                    message: translatedMessage,
                    messagedBy,
                    roomno: sessionId
                });
            } else {
                await sql.query`INSERT INTO messages_ (roomno, message, messagedBy, translated_customer, translated_captain, time, isRead) VALUES (${roomno}, ${message}, ${messagedBy}, ${translatedMessage}, ${message}, ${time}, 0)`;
                socket.to(roomno).emit("receive-message", {
                    message: translatedMessage,
                    messagedBy,
                    roomno
                });
            }
        } else if (messagedBy === 'customer') {
            if (type === 'cico') {
                socket.broadcast.emit("get-captain-language", { message, type: 'cico', sessionId })
            } else {
                socket.broadcast.emit("get-captain-language", { message, type, sessionId, roomno })
            }
        }
    });

    socket.on("captain-language", async ({ language, message, roomno, type, sessionId }) => {
        /* console.log(language, message, type, sessionId); */
        const translatedMessage = await translate(message, language);
        if (type === 'cico') {
            await sql.query`INSERT INTO messages_ (message, messagedBy, translated_customer, translated_captain, time, isRead, type, sessionId) VALUES (${message}, 'customer', ${message}, ${translatedMessage}, ${new Date().toLocaleTimeString(
                'en-US',
                { hour: 'numeric', minute: 'numeric', hour12: true },
            )}, 0, ${type}, ${sessionId})`;
        }
        else {
            await sql.query`INSERT INTO messages_ (roomno, message, messagedBy, translated_customer, translated_captain, time, isRead, type) VALUES (${roomno}, ${message}, 'customer', ${message}, ${translatedMessage}, ${new Date().toLocaleTimeString(
                'en-US',
                { hour: 'numeric', minute: 'numeric', hour12: true },
            )}, 0, ${type})`;
        }
        if (type === 'sos') {
            socket.emit("receive-sos-message", {
                message: translatedMessage,
                messagedBy: 'customer',
                roomno
            });
        } else {
            socket.emit("receive-message", {
                message: translatedMessage,
                messagedBy: 'customer',
                roomno
            });
        }
    });

    socket.on("send-sos", async ({ roomno, message, messagedBy, language, time }) => {
        /*  console.log(roomno, message, messagedBy, language, time); */
        socket.broadcast.emit("sos-notification", { message: "You have received a SOS message from a customer" });
        socket.broadcast.emit("get-captain-language", { message, type: 'sos', roomno })
    });

    socket.on("sos-reply", async ({ roomno, message, messagedBy, language, time }) => {
        /* console.log(roomno, message, messagedBy, language, time); */
        const result = await sql.query`SELECT language FROM customers c WHERE c.room_no = ${roomno}`;
        /* console.log(result.recordset); */
        const language_ = result.recordset[0].language ?? 'en';
        const translatedMessage = await translate(message, language_);
        await sql.query`INSERT INTO messages_ (roomno, message, messagedBy, translated_customer, translated_captain, time, isRead, type) VALUES (${roomno}, ${message}, ${messagedBy}, ${translatedMessage}, ${message}, ${time}, 1, 'sos')`;
        socket.to(roomno).emit("receive-sos-reply", {
            message: translatedMessage,
            messagedBy
        });
    });
});

app.get("/node-api/get-all-messages-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;
    const result_ = await sql.query`SELECT DISTINCT date FROM messages_ m WHERE m.roomno = ${roomno} AND type IS NULL`;
    const result = await sql.query`SELECT * FROM messages_ WHERE roomno = ${roomno} AND type IS NULL`;

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
    /*  console.log(token, authorization); */

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
    /* console.log(token, authorization); */

    if (!token) return res.status(403).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { emp_id } = decoded;

    /* console.log(req.body); */

    const { name, employee_id, email, language, phoneno } = req.body;

    const result = await sql.query`UPDATE captain SET name = ${name}, email = ${email}, language = ${language}, phoneno = ${phoneno} WHERE employee_id = ${emp_id}`;

    res.json({
        success: true,
        message: "Captain updated successfully"
    });
});

app.get("/node-api/captain/get-sos-notifications", async (req, res) => {
    try {
        const notifications = await sql.query`SELECT * FROM messages_ WHERE type = 'sos' AND isRead = 0 ORDER BY timestamp DESC`;

        const sortedNotifications = Object.groupBy(notifications.recordset, ({ roomno }) => roomno);
        const result = Object.keys(sortedNotifications).map((key) => {
            return {
                roomno: key,
                lastMessage: sortedNotifications[key][0].translated_captain,
                count: sortedNotifications[key].length,
                time: sortedNotifications[key][0].time
            }
        });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

app.get("/node-api/get-all-sos-messages-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;
    const result_ = await sql.query`SELECT DISTINCT date FROM messages_ m WHERE m.roomno = ${roomno} AND type = 'sos'`;
    const result = await sql.query`SELECT * FROM messages_ WHERE roomno = ${roomno} AND type = 'sos'`;
    await sql.query`UPDATE messages_ SET isRead = 1 WHERE roomno = ${roomno} AND type = 'sos' AND isRead = 0`;

    let arrangedResult = {};
    for (let element of result_.recordset) {
        arrangedResult[element.date] = result.recordset.filter((item) => item.date + "" === element.date + "");
    }

    res.json({
        success: true,
        messages: arrangedResult
    });
});

app.get("/node-api/get-all-cico-messages-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;
    const result_ = await sql.query`SELECT DISTINCT date FROM messages_ m WHERE m.sessionId = ${roomno} AND type = 'cico'`;
    const result = await sql.query`SELECT * FROM messages_ WHERE sessionId = ${roomno} AND type = 'cico'`;
    await sql.query`UPDATE messages_ SET isRead = 1 WHERE sessionId = ${roomno} AND type = 'cico' AND isRead = 0`;

    let arrangedResult = {};
    for (let element of result_.recordset) {
        arrangedResult[element.date] = result.recordset.filter((item) => item.date + "" === element.date + "");
    }

    res.json({
        success: true,
        messages: arrangedResult
    });
});

app.post("/node-api/customer/auth", async (req, res) => {
    try {
        const { name, email, roomno, support } = req.body;

        let result;
        let sessionId;

        if (roomno) {
            sessionId = roomno;
            result = await sql.query`SELECT * FROM customers WHERE room_no = ${roomno} AND email = ${email}`;
        } else {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now();
            result = await sql.query`SELECT * FROM customers WHERE email = ${email}`;
        }

        if (result.recordset.length === 0) {
            res.status(401).json({
                success: false,
                message: "You are not a registered customer."
            });
        } else {
            const check = await sql.query`SELECT * FROM support WHERE email = ${email}`;
            if (check.recordset.length === 0) {
                await sql.query`INSERT INTO support (type, customerName, sessionId, email) VALUES (${support}, ${name}, ${sessionId ?? roomno}, ${email})`;
            }
            const token = jwt.sign({ sessionId: sessionId ?? roomno }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
            res.status(200).json({
                success: true,
                token,
                name,
                sessionId
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

server.listen(PORT, async () => {
    try {
        await sql.connect(process.env.DATABASE_URL);
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.log(err);
    }
});