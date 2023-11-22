import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import sql from 'mssql';
import 'dotenv/config';
import gTTS from 'gtts';

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

io.on("connection", (socket) => {
    socket.on("bot_chat", ({ message }) => {
        const responses = {
            "How can I book a room?": "To book a room, you can visit our official website or call our reservation hotline. Our user-friendly online booking system allows you to choose your preferred dates, room type, and any additional amenities you might need.",
            "What types of rooms do you offer?": "We offer a variety of room types to cater to different preferences. Our options include standard rooms, suites, and deluxe rooms. Each is designed to provide comfort and meet the diverse needs of our guests.",
            "What are the room rates?": "Room rates vary based on factors such as room type, view, and the dates of your stay. For the most accurate and up-to-date rates, we recommend checking our website or contacting our reservations team.",
            "Are there any discounts available?": "Yes, we offer various discounts for early bookings, loyalty members, and special promotions. For detailed information on current discounts, please check our website or get in touch with our reservations team.",
            "Can I cancel my reservation?": "Yes, you can cancel your reservation. Our cancellation policy allows for flexibility. You can manage your reservation by logging into your account on our website or by contacting our reservations team directly.",
            "Tell me about your check-in/check-out process.": "Check-in time is at 3:00 PM, and check-out time is at 11:00 AM. If you require early check-in or late check-out, please let us know in advance, and we'll do our best to accommodate your request.",
            "What amenities do the rooms have?": "Our rooms are equipped with modern amenities, including free Wi-Fi, TV, air conditioning, a minibar, and comfortable bedding. Feel free to contact our front desk for specific details or additional requests.",
            "Is breakfast included in the room rate?": "Yes, breakfast is included in the room rate. We offer a complimentary breakfast buffet for our guests, featuring a variety of delicious options to start your day.",
            "Do you have a gym or fitness center?": "Absolutely! We have a fully equipped gym and fitness center available for our guests. Maintain your workout routine during your stay with us.",
            "Are pets allowed in the hotel?": "Yes, we are a pet-friendly hotel. We understand that pets are part of the family, so feel free to inform us in advance if you plan to bring your furry friend along.",
            "How can I reach the hotel from the airport?": "You can reach the hotel from the airport by taking a taxi, using our shuttle service, or using public transportation. For detailed directions and transportation options, please contact us.",
            "What's the Wi-Fi password?": "The Wi-Fi password for our hotel is 'Arrive123'. Enjoy complimentary high-speed internet access during your stay.",
            "Do you offer room service?": "Yes, we offer room service for your convenience. You can find the room service menu in your room, offering a selection of delicious meals and snacks.",
            "Is there parking available?": "Yes, we have parking available for our guests. Please note that there may be a fee depending on the type of parking.",
            "Tell me about nearby attractions.": "Nearby attractions include parks, museums, and shopping centers. Our front desk can provide personalized recommendations based on your interests and preferences.",
            "Are there any restaurants nearby?": "There are several restaurants within walking distance of the hotel, offering a variety of cuisines. Explore the local dining scene for a delightful culinary experience.",
            "Can I request a late check-out?": "Late check-out requests are subject to availability. Please contact our front desk on the day of your departure to inquire about the possibility of a late check-out.",
            "What's your cancellation policy?": "Our cancellation policy varies depending on the type of reservation. For specific details, please refer to your confirmation email or contact our reservations team.",
            "Do you have a pool?": "Yes, we have a swimming pool available for our guests to enjoy. Relax and unwind by taking a refreshing dip in our inviting pool area."
        };

        socket.emit("bot_chat", {
            messages: [
                responses[message] || "Sorry, I don't understand. Please try again."
            ],
        })
    });

    socket.on("add-room-user", async ({ roomno, service }) => {
        console.log(roomno, service);

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
        console.log(roomno);

        try {
            await sql.query`DELETE FROM services WHERE room = ${roomno}`;
        } catch (err) {
            console.log(err);
        }
    });

    socket.on("get-all-rooms-captain", async () => {
        const result = await sql.query("SELECT DISTINCT room FROM services");
        console.log(result.recordset)

        socket.emit("get-all-rooms-captain", {
            rooms: result.recordset
        });
    });

    socket.on('join-room', ({ roomno }) => {
        console.log(roomno);
        socket.join(roomno);
    });

    socket.on("send-message", async ({ roomno, message, messagedBy }) => {
        console.log(roomno, message, messagedBy);

        await sql.query`INSERT INTO messages_ (roomno, message, messagedBy) VALUES (${roomno}, ${message}, ${messagedBy})`;
        socket.to(roomno).emit("receive-message", {
            message,
            messagedBy
        });
    });
});

app.get("/node-api/get-all-messages-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;
    const result = await sql.query`SELECT * FROM messages_ WHERE roomno = ${roomno}`;
    console.log(result.recordset)

    res.json({
        success: true,
        messages: result.recordset
    });
});

app.get("/node-api/get-services-by-room/:roomno", async (req, res) => {
    const { roomno } = req.params;

    try {
        const result = await sql.query`SELECT service FROM services WHERE room = ${roomno}`;
        console.log(result.recordset);

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
        console.log(result.recordset);

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

    const lang = {
        english: 'en',
        arabic: 'ar',
        russian: 'ru',
        french: 'fr',
        german: 'de',
        italian: 'it',
        spanish: 'es'
    };

    const gtts = new gTTS(message, lang[language] ?? 'en');
    res.setHeader('Content-Type', 'audio/mpeg');
    gtts.stream().pipe(res);
});

server.listen(PORT, async () => {
    try {
        await sql.connect(process.env.DATABASE_URL);
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        console.log(err);
    }
});