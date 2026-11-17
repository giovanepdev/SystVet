import express from 'express';
import path from 'path';
import { autenticar } from './auth';
import login from './routes/login';
import tutores from './routes/tutores';
import pets from './routes/pets';
import agendamentos from './routes/agendamentos';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/login', login);
app.use('/api/tutores', autenticar, tutores);
app.use('/api/pets', autenticar, pets);
app.use('/api/agendamentos', autenticar, agendamentos);

const PORTA = Number(process.env.PORT) || 3000;
app.listen(PORTA, () => console.log(`Sistema rodando em http://localhost:${PORTA}`));
