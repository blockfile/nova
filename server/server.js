const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Replicate = require("replicate");
const app = express();
const PORT = 3001;
require("dotenv").config();

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
});

// CORS Configuration
const corsOptions = {
    origin: ["https://app.novaai.systems", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

app.use(bodyParser.json());

// API Route for Generating Chat Response
app.post("/api/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        const output = await replicate.run("meta/llama-2-13b-chat", {
            input: {
                prompt: prompt,
                max_length: 75,
                temperature: 0.7,
            },
        });

        res.json({ response: output.join("") });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// API Route for Generating Images
app.post("/api/generateImages", async (req, res) => {
    const { prompt } = req.body;

    try {
        console.log("Request Body:", req.body);

        const prediction = await replicate.run(
            "black-forest-labs/flux-1.1-pro-ultra",
            {
                input: {
                    prompt: prompt || "default prompt",
                    aspect_ratio: "3:2",
                },
            }
        );

        console.log("Replicate Prediction:", prediction);

        if (prediction instanceof ReadableStream) {
            const reader = prediction.getReader();
            let chunks = [];

            // Read the stream and convert it to a buffer
            const processStream = async () => {
                const { value, done } = await reader.read();
                if (done) {
                    const buffer = Buffer.concat(chunks);
                    const base64Image = buffer.toString("base64");
                    res.status(200).json({
                        imageUrl: `data:image/jpeg;base64,${base64Image}`,
                    });
                } else {
                    chunks.push(value);
                    processStream();
                }
            };

            await processStream();
        } else if (typeof prediction === "string") {
            res.status(200).json({ imageUrl: prediction });
        } else if (prediction && prediction.output) {
            res.status(200).json({ imageUrl: prediction.output[0] });
        } else {
            throw new Error("Unexpected response format");
        }
    } catch (error) {
        console.error("Error generating image:", error.message);
        res.status(500).json({ error: "Failed to generate image." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
