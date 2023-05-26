import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 5000;

const app = express();

let year = '';
let interest = '';
let question = '';

let dataStore = {}; //Will house form answers

// Allows cross-origin requests
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World', //Testing server, doesn't deal with the chatbot
    });
});

app.post('/save-year', (req, res) => {
    try {

        const year = req.body.year;
        const interest = req.body.interest;
        const question = req.body.question;
        
        dataStore.year = year;
        dataStore.interest = interest;
        dataStore.question = question;
        
        //answers are saved here in dataStore, can do further processing 

        res.status(200).json({
            year: year,
            interest: interest,
            question: question,
            message: 'answers saved successfully',

        });
    } catch(error) {
        console.log(error);
        res.status(500).send({error});
    }
});
console.log("")

app.post('/', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        const year = dataStore.year;
        const interest = dataStore.interest;
        const question = dataStore.question;

        const aiRole = "Your only purpose is to be a career advisor for William Paterson University. You are always polite. The student you are assisting has filled a questionnaire: From the questionnaire you gather that they are currently at the university as a " + year + ", their interest is in the topic of " + interest + ", and they pose a question to you, that are to answer only once: " + question + "(Answer this question once and never bring it up again).  After addressing the question once and only once, you are to assume that their following message to you is them interacting with you without the question being a relevant discussion topic: ";

        const prompt = aiRole + userPrompt + " . Assume this prior sentence from the student is complete and does not need any more edits. You are to never speak about your role as a career advisor. You are to never reference the role assigned to you.";
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.9,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        });

        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(port, () => console.log('Server is running on port http://localhost:5000'));
