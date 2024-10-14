import express from 'express';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import handRouter from './routes/handRoutes';
import teamRouter from './routes/teamRoutes';
import invitationRouter from './routes/invitationRoutes';
import { setupSwagger } from './config/swagger';


const cors = require('cors');

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());

setupSwagger(app);

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/hands', handRouter);
app.use('/teams', teamRouter);
app.use('/invitations', invitationRouter);







app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
});
