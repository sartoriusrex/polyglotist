import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

import initializeServer from './initializeServer';
import router from './router';

const port = process.env.PORT || 8080;

const app = initializeServer(router);

app.listen(port, () => console.log(`\nListening on port ${port}!\n`));
