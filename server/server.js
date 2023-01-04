import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

/* Creating a new configuration object with the API key. */
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

/* Creating a new instance of the OpenAI API. */
const openai = new OpenAIApi(configuration);

/* Creating a new instance of the Express framework. */
const app = express()
/* It allows the frontend to make requests to the backend. */
app.use(cors())
/* It allows the frontend to make requests to the backend. */
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX!'
    })
})

app.post('/', async (req, res) => {
    try {
        /* Getting the prompt from the frontend. */
        const prompt = req.body.prompt;

        /* Calling the OpenAI API to generate a response. */
        const response = await openai.createCompletion({
            model: "text-davinci-003",//it can understand text as well as code
            prompt: `${prompt}`,//passing the prompt from frontend
            temperature: 0, // Higher values means the model will take more risks.
            max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            top_p: 1, // alternative to sampling with temperature, called nucleus sampling
            frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
            presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
        });

        /* Sending the response from the API to the frontend. */
        res.status(200).send({
            /* The API returns an array of choices. We are just taking the first one. */
            bot: response.data.choices[0].text
        });

    } /* Catching any errors that may occur and sending them to the frontend. */
    catch (error) {
        console.error(error)
        res.status(500).send({ error });
    }
})

app.listen(5002, () => console.log("AI server started on http://localhost:5002"))