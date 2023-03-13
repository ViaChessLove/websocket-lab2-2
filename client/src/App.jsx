import {
  useState,
  useEffect,
  useRef,
} from 'react';

import { WS_METHODS } from './constants';

const App = (props) => {
  const [text, setText] = useState('');
  const [notifications, setNotifications] = useState('');

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000/');

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        id: 1,
        username: 'vyacheslav',
        method: WS_METHODS.Connection,
      }));
    }

    return () => {
      ws.current.close();
    }
  }, []);

  useEffect(() => {
    ws.current.onmessage = ({ data }) => {
      data = JSON.parse(data);

      switch(data['method']) {
        case WS_METHODS.Connection: {
          alert(data['data']);
          break;
        }
        case WS_METHODS.List: {
          setNotifications(data['data']);
          break;
        }
        default: {
          break;
        }
      }
    }
  }, [ws]);

  const handleGetList = () => {
    ws.current.send(JSON.stringify({
      id: 1,
      username: 'vyacheslav',
      method: WS_METHODS.List,
    }));
  };

  const handleSendS = () => {
    if (!text) {
      ws.current.send(JSON.stringify({
        id: 1,
        username: 'vyacheslav',
        method: WS_METHODS.Close,
      }));

      ws.current.close();
      return;
    }

    ws.current.send(JSON.stringify({
      id: 1,
      username: 'vyacheslav',
      method: WS_METHODS.NewMessage,
      body: text,
    }));
  }

  return (
    <>
    <div ref={ws} className="App">
      <button onClick={handleGetList}>
        List
      </button>
      <input
        type="text"
        value={text}
        onChange={({ target }) => setText(target.value)}
      />
      <button onClick={handleSendS}>
        Send
      </button>
    </div>
    {notifications && notifications.map(({ id, message }) => (
      <div style={{ marginTop: '20px'}} key={id}>
        {message}
        <hr />
      </div>
    ))}
    </>
  )
}

export default App
