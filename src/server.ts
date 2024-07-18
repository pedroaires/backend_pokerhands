import express, { Request, Response } from 'express';


const app = express();
const port = 3000;


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});

interface Hand {
    id: number;
    [key: string]: any;
}
let hands: Hand[] = [];

app.get('/hands', (req: Request, res: Response) => {
    res.send({"hands": hands});
});

app.post('/hands', (req: Request, res: Response) => {
    req.body.id = hands.length + 1;
    hands.push(req.body);
    res.send({"hands": hands});
});

app.put('/hands/:id', (req: Request, res: Response) => {
    let id = Number(req.params.id);
    let handIndex = hands.findIndex(hand => hand.id === id);
    if (handIndex === -1) {
        res.status(404).send({ message: 'Hand not found' });
        return;
    }

    hands[handIndex] = {
        id: hands[handIndex].id,
        ...req.body
    };

    res.send({ "hands": hands });
});

app.delete('/hands/:id', (req: Request, res: Response) => {
    let id = Number(req.params.id);
    let hand = hands.find(hand => hand.id === id);
    if (hand) {
        hands.splice(hands.indexOf(hand), 1);
        res.send({"hands": hands});
    }
    else {
        res.status(404).send({ message: 'Hand not found' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
