import React, { useEffect, useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

export const FirebaseDemo: React.FC = () => {
  const { firestore, currentUser } = useFirebase();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const messagesRef = collection(firestore, 'messages');
        const snapshot = await getDocs(messagesRef);
        const messageList = snapshot.docs.map(doc => doc.data().text as string);
        setMessages(messageList);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [firestore]);

  // Add a new message to Firestore
  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(firestore, 'messages');
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: new Date(),
        userId: currentUser?.uid || 'anonymous',
      });
      
      // Add message to state for immediate display
      setMessages(prev => [...prev, newMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-4 m-4"
    >
      <h2 className="text-xl text-purple-300 font-display mb-4">Firebase Demo</h2>
      
      <div className="mb-4">
        <h3 className="text-md text-cyan-300 mb-2">Messages:</h3>
        {isLoading ? (
          <p className="text-purple-200 opacity-70">Loading messages...</p>
        ) : messages.length > 0 ? (
          <ul className="space-y-2">
            {messages.map((message, index) => (
              <motion.li 
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-purple-900/30 p-2 rounded-md text-white"
              >
                {message}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-purple-200 opacity-70">No messages yet. Be the first to add one!</p>
        )}
      </div>
      
      <form onSubmit={handleAddMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-purple-900/30 text-white p-2 rounded-md flex-1 border border-purple-600/50 focus:outline-none focus:border-cyan-300"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="btn-secondary px-4 py-2"
        >
          Send
        </motion.button>
      </form>
    </motion.div>
  );
}; 