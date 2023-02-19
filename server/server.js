import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

// Define a new endpoint for RapidAPI
app.post("/generate-text", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

// Define another endpoint for RapidAPI
app.get("/ping", async (req, res) => {
  res.status(200).send({
    message: "Pong!",
  });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`AI server started on http://localhost:${port}`)
);

// Export the app for use with RapidAPI
export default app;
