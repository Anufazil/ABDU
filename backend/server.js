const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "ABDU AI Backend"
    });
});

app.post("/api/chat", async (req, res) => {

    try {

        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Messages are required."
            });
        }

        const completion =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages
            });

        const answer =
            completion.choices?.[0]?.message?.content?.trim();

        if (!answer) {
            return res.status(500).json({
                error: "AI returned an empty response."
            });
        }

        res.json({
            message: {
                role: "assistant",
                content: answer
            }
        });

    } catch (error) {

        console.error("ABDU AI Backend Error:", error);

        res.status(500).json({
            error: "Unable to connect to the AI service."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`ABDU AI Backend running on port ${PORT}`);
});