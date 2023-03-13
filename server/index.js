import express from 'express';
import mongoose from 'mongoose';
import expressWs from 'express-ws';

import * as constants from './constants.js';
import Notification from './Notification/index.js';

const app = express();

app.use(express.json());

const wsServer = expressWs(app);

const aWss = wsServer.getWss();

const broadCastConnection = (ws, msg) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      client.send(JSON.stringify({
        method: constants.WS_METHODS.Connection,
        data: `user connected - ${msg.username}`,
      }))
    }
  })
}

app.ws('/', (ws) => {
  ws.on('message', async (msg) => {
    msg = JSON.parse(`${msg}`);

    switch (msg.method) {
      case constants.WS_METHODS.Connection: {
        ws.id = msg.id;

        broadCastConnection(ws, msg);
        break;
      }
      case constants.WS_METHODS.List: {
        const messages = await Notification.find();

        ws.send(JSON.stringify({
          method: constants.WS_METHODS.List,
          data: messages,
        }));
        break;
      }
      case constants.WS_METHODS.Close: {
        ws.close();
        break;
      }
      case constants.WS_METHODS.NewMessage: {
        msg.body.split(';').forEach(async (message) => {
          await Notification.create({
            id: Math.random(),
            message,
          });
        });
        
        const data = await Notification.find();

        ws.send(JSON.stringify({
          method: constants.WS_METHODS.List,
          data: data,
        }))
        break;
      }
      default: {
        break;
      }
    }
  });
});

(async () => {
  try {
    await mongoose.connect(constants.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    app.listen(constants.PORT, () => console.log(`listening ${constants.PORT}`));

  } catch (e) {
    console.warn(e);
  }
})();
