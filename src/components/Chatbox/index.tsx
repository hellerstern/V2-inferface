import { useState, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import moment from 'moment';

interface IMessage {
  profilePicture: any;
  username: string;
  date: string;
  time: string;
  message: string;
}
const Message = ({ profilePicture, username, date, time, message }: IMessage) => {
  return (
    <div style={{ display: 'flex', marginBottom: 20 }}>
      <img
        src={profilePicture}
        alt="Profile"
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <div style={{ marginLeft: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontWeight: 'normal' }}>{username}</h4>
          <span style={{ marginLeft: 10, color: '#8e9297' }}>
            {moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format(
              'MMM DD, YYYY HH:mm'
            )}
          </span>
        </div>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message}</p>
      </div>
    </div>
  );
};

export const Chatbox = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (isDragging) {
        setCurrentPosition({
          x: event.clientX - initialPosition.x,
          y: event.clientY - initialPosition.y
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, initialPosition]);

  const handleMouseDown = (event: any) => {
    setInitialPosition({
      x: event.clientX - currentPosition.x,
      y: event.clientY - currentPosition.y
    });
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      profilePicture: "https://media.tenor.com/NoMOEOtIhJQAAAAd/discord-profile-neko.gif",
      username: "GainsGoblin",
      date: "2022-12-30",
      time: "5:18",
      message: "Hello"
    },
    {
      profilePicture: "https://i.pinimg.com/736x/1d/58/75/1d58751a974becc20dd43507e7fbf1c6.jpg",
      username: "Telcontar",
      date: "2022-12-30",
      time: "5:19",
      message: ":pepeweird:"
    },
    {
      profilePicture: "https://pbs.twimg.com/profile_images/1370228657717866496/ev0xEQrK_400x400.jpg",
      username: "Heinz",
      date: "2022-12-30",
      time: "5:21",
      message: "Sunflower farm is making millionzz"
    }
  ]);

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    // Send message logic goes here
    if(message !== "") {
      setMessages([...messages,
        {
          profilePicture: "https://i1.sndcdn.com/artworks-yoaYzcn8fmBy6F3O-Ex8ICg-t500x500.jpg",
          username: "AnonTrader123",
          date: "2022-12-30",
          time: ((new Date().getHours().toString()) + ":" + (new Date().getMinutes().toString())),
          message: message
        }
      ]);
      setMessage('');
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
<div
  style={{
    position: 'absolute',
    left: currentPosition.x,
    top: currentPosition.y,
    width: 400,
    height: 500,
    backgroundColor: '#36393f',
    borderRadius: 10,
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    zIndex: 1000
  }}
>
  <div
    style={{
      width: '100%',
      height: 50,
      backgroundColor: '#2f3136',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0px 20px'
    }}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
  >
    <h3 style={{ margin: 0, fontWeight: 'normal', color: 'white' }}>Chatbox</h3>
    <button
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#72767d'
      }}
    >
      <FaRegTimesCircle size={20} />
    </button>
  </div>
  <div
    style={{
      width: '100%',
      height: 400,
      overflow: 'auto',
      padding: 20,
      color: 'white'
    }}
  >
    <div style={{ overflowY: 'scroll', height: 340 }}>
      {messages.map((message, index) => (
        <Message
          key={index}
          profilePicture={message.profilePicture}
          username={message.username}
          date={message.date}
          time={message.time}
          message={message.message}
        />
      ))}
    </div>
  </div>
  <div
    style={{
      width: '100%',
      height: 50,
      backgroundColor: '#2f3136',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      display: 'flex',
      alignItems: 'center',
      padding: '0px 20px'
    }}
  >
    <input
      style={{
        flex: 1,
        background: 'none',
        border: 'none',
        outline: 'none',
        color: 'white'
      }}
      placeholder="Send a message..."
      value={message}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
    <button
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#43b581'
      }}
      onClick={handleSend}
    >
      Send
    </button>
  </div>
</div>
  );
}
