import express from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import handRouter from './routes/handRoutes';
import teamRouter from './routes/teamRoutes';
import invitationRouter from './routes/invitationRoutes';

const cors = require('cors');

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/hands', handRouter);
app.use('/teams', teamRouter);
app.use('/invitations', invitationRouter);







app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
