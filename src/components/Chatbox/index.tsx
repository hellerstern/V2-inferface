import { useState, useEffect, useRef } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { MdSend } from "react-icons/md";
import moment from 'moment';
import { useSpring, animated } from '@react-spring/web'
import './chatbubble.css';
import { chatSocket } from 'src/context/socket';
import { TraderProfile } from 'src/context/profile';

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
        style={{ width: 40, height: 40, borderRadius: 999}}
      />
      <div style={{ marginLeft: 10}}>
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

  // SERVER MESSAGING

  const messageTracker = useRef(-1);
  const messagesFinished = useRef(false);

  useEffect(() =>{
    if (messageTracker.current >= 0) return;
    messageTracker.current += 1;
    fetchMessages();
  }, []);

  const [fetchTimeout, setFetchTimeout] = useState(0);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  async function fetchMessages() {
    if (fetchTimeout > Date.now()) return;
    setFetchTimeout(Date.now() + 200);
    const toFetch = 'https://chatbox-server-l9yj9.ondigitalocean.app/messages?start='+(messageTracker.current.toString())+'&end='+((messageTracker.current + 20).toString());
    messageTracker.current += 20;
    const response = await fetch(toFetch);
    const newMessages = await response.json();
    if (newMessages.length === 0) messagesFinished.current = true;
    if (messagesListRef.current) {
      // Get the total height of the messages list
      totalHeightBefore.current = messagesListRef.current.scrollHeight;
    }
    setMessages(prevMessages => [...newMessages.slice().reverse(), ...prevMessages]);
  }
  const totalHeightBefore = useRef(0);
  const [isHistoryFetched, setIsHistoryFetched] = useState(false);
  useEffect(() => {
    if (messagesListRef.current && isHistoryFetched) {
      // Get the total height of the messages list
      const totalHeightAfter = messagesListRef.current.scrollHeight;
      messagesListRef.current.scrollTop = totalHeightAfter - totalHeightBefore.current;
    }
    return() => {
      setIsHistoryFetched(false);
    }
  }, [isHistoryFetched]);

  // Listen for new messages
  useEffect(() => {
    chatSocket.off('message');
    chatSocket.on('message', (data: any) => {
      setMessages([...messages,
        {
          profilePicture: data.profilePicture,
          username: data.username,
          date: data.date,
          time: data.time,
          message: data.message
        }
      ]);
    });
  }, [messages]);

  const messagesListRef = useRef<any>(null);
  const scrollToBottomIfNeeded = () => {
    if (messagesListRef.current) {
      // Get the last child element of the messages list
      const lastMessage = messagesListRef.current.lastChild;

      // Get the total height of the messages list
      const totalHeight = messagesListRef.current.scrollHeight;

      // Get the current scroll position of the messages list
      const scrollPosition = messagesListRef.current.scrollTop;

      // Calculate the height of the visible portion of the messages list
      const visibleHeight = messagesListRef.current.offsetHeight;

      // Check if the scroll position is at the bottom of the list
      if ((scrollPosition as number) + (visibleHeight as number) + 300 >= totalHeight) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }
    }
  };
  
  const handleSend = () => {
    // Send message logic goes here
    if(message !== "") {
      const profile = TraderProfile();
      chatSocket.emit('receive', {
        username: profile.username,
        profilePicture: profile.profilePicture,
        date: new Date().toISOString().slice(0, 10),
        time: ((new Date().getHours().toString()) + ":" + (new Date().getMinutes().toString())),
        message: message
      });
      setMessage('');
      userSent.current = true;
    }
  };

  const handleChange = (event: any) => {
    setMessage(event.target.value);
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
    } else {
      scrollToBottomIfNeeded();
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
  }

  const handleScroll = () => {
    if (fetchTimeout > Date.now()) return;
    if (!messagesFinished.current) {
      // Check if the user has scrolled near the top of the messages list
      if (messagesListRef.current.scrollTop <= 200) {
        // Query more messages from the server
        fetchMessages().then(() => {
          setIsHistoryFetched(true);
        });
      }
    }
  };

  // Dragging
  const [isDragging, setIsDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 10, y: 200 });
  const [currentPosition, setCurrentPosition] = useState({ x: 10, y: 200 });
  const messagesEnd = useRef<any>();

  const [isClosed, setClosed] = useState(true);

  const getClientPos = (event: any) => {
    if (event.touches) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY
      };
    }
    return {
      clientX: event.clientX,
      clientY: event.clientY
    };
  }

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (isDragging) {
        event.preventDefault();
        const { clientX, clientY } = getClientPos(event);
        setCurrentPosition({
          x: clientX - initialPosition.x,
          y: clientY - initialPosition.y
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
    };
  }, [isDragging, initialPosition]);

  const handleMouseDown = (event: any) => {
    const { clientX, clientY } = getClientPos(event);
    setInitialPosition({
      x: clientX - currentPosition.x,
      y: clientY - currentPosition.y
    });
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
    });
    if (!isClosed) {
      messagesEnd.current.scrollIntoView({ behavior: "auto", block: "end", inline: "nearest" });
    }
  }, [isClosed]);

  return (
    <div
      style={{
        touchAction: 'none',
        zIndex: 1
      }}
    >
      {
        isClosed ?
        <animated.div
        style={{
          position: 'fixed',
          cursor: 'pointer',
          ...springs
        }}
        >
          <HiChatBubbleLeftRight size={20} style={{
            position: 'relative',
            top: 41,
            left: 15,
            zIndex: 1,
            color: '#FFFFFF',
            pointerEvents: 'none'
          }}/>
          <div className="spinner"
          onClick={() => {
            setClosed(false);
          }}
          />
        </animated.div>
        :
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
              padding: '0px 10px',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            <div style={{ margin: 0, fontWeight: '400', fontSize: 14, color: '#72767d'}}>Open Chat</div>
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
              height: 320,
              overflow: 'auto',
              paddingLeft: 10,
              paddingRight: 0,
              color: 'white'
            }}
          >
            <div style={{ overflowY: 'scroll', height: '100%' }} ref={messagesListRef} onScroll={() => handleScroll()}>
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
              <div ref={(el) => { messagesEnd.current = el; }} style={{ float:"left", clear: "both" }}/>
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: 40,
              backgroundColor: '#2f3136',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              padding: '0px 10px'
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
                color: '#43b581',
                marginBottom: -5
              }}
              onClick={handleSend}
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      }
    </div>
  );
}
