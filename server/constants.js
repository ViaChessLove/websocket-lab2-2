const MOCKS = [
  {
    id: 1,
    message: 'Первое сообщение',
  },
  {
    id: 2,
    message: 'второе сообщение',
  },
  {
    id: 3,
    message: 'третье сообщение',
  },
  {
    id: 4,
    message: 'четвертое сообщение',
  },
];

const PORT = process.env.PORT || 5000;

const WS_METHODS = {
  Connection: 'connection',
  List: 'list',
  NewMessage: 's',
  Close: 'close',
}

const DB_URL = 'mongodb+srv://user:QbbU0nNkv3EXx3HI@cluster0.7fxgf8y.mongodb.net/test';

export {
  MOCKS,
  PORT,
  DB_URL,
  WS_METHODS,
}