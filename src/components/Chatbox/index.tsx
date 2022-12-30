import { useState, useEffect, useRef } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import moment from 'moment';
import { useSpring, animated } from '@react-spring/web'
import './chatbubble.css';

interface IMessage {
  profilePicture: any;
  username: string;
  date: string;
  time: string;
  message: string;
}
const Message = ({ profilePicture, username, date, time, message }: IMessage) => {
  return (
    <div style={{ display: 'flex', marginBottom: 20, marginTop: 5 }}>
      <img
        src={profilePicture}
        alt="Profile"
        style={{ width: 30, height: 30, borderRadius: 999}}
      />
      <div style={{ marginLeft: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontWeight: 'normal', fontSize: '13px' }}>{username}
          <span style={{ marginLeft: 10, color: '#8e9297', fontSize: '13px' }}>
            {moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format(
              'MMM DD, HH:mm'
            )}
          </span>
          </h4>
        </div>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '13px' }}>{message}</p>
      </div>
    </div>
  );
};

export const Chatbox = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 10, y: 200 });
  const [currentPosition, setCurrentPosition] = useState({ x: 10, y: 200 });
  const messagesEnd = useRef<any>();
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
  const [isClosed, setClosed] = useState(true);

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

  const handleChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    // Send message logic goes here
    if(message !== "") {
      userSent.current = true;
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

  const userSent = useRef(false);

  useEffect(() => {
    if (userSent.current) {
      userSent.current = false;
      scrollToBottom();
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
  }

  const [springs, api] = useSpring(() => ({
    from: {
      x: currentPosition.x,
      y: currentPosition.y
    },
    to: {
      x: 10,
      y: currentPosition.y
    }
  }))

  useEffect(() => {
    api.start({
      from: {
        x: currentPosition.x,
        y: currentPosition.y
      },
      to: {
        x: 10,
        y: currentPosition.y
      }
    })
  }, [isClosed]);

  return (
    <div>
      {
        isClosed ?
        <animated.div
        style={{
          position: 'fixed',
          ...springs
        }}
        >
          <HiChatBubbleLeftRight size={20} style={{
            position: 'relative',
            top: 41,
            left: 15,
            zIndex: 1000,
            color: '#FFFFFF',
            pointerEvents: 'none'
          }}/>
          <div className="spinner"
          onClick={() => {
            setClosed(false)
          }}
          />
        </animated.div>
        :
        <div style={
          isDragging ? {
            userSelect: 'none',
            MozUserSelect: 'none',
            KhtmlUserSelect: 'none',
            WebkitUserSelect: 'none'
          } : {}
        }>
          <div
            style={{
              position: 'fixed',
              left: currentPosition.x,
              top: currentPosition.y,
              width: 300,
              height: 400,
              backgroundColor: '#36393f',
              borderRadius: 0,
              boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
              zIndex: 1000
            }}
          >
            <div
              style={{
                width: '100%',
                height: 40,
                backgroundColor: '#2f3136',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0px 20px'
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <h4 style={{ margin: 0, fontWeight: 'normal', color: 'white' }}>Chatbox</h4>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#72767d'
                }}
                onClick={() => setClosed(true)}
              >
                <FaRegTimesCircle size={20} />
              </button>
            </div>
            <div
              style={{
                width: '100%',
                height: 310,
                overflow: 'auto',
                paddingLeft: 20,
                paddingRight: 20,
                color: 'white'
              }}
            >
              <div style={{ overflowY: 'scroll', height: '100%' }}>
                <div>
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
                <div ref={(el) => { messagesEnd.current = el; }} style={{ float:"left", clear: "both" }}/>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: 50,
                backgroundColor: '#2f3136',
                borderRadius: 0,
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
        </div>
      }
    </div>
  );
}
