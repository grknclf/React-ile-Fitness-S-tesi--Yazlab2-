import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { auth, firestore } from "../../firebaseConfig";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import './chatpage.css';
import { Paper, Button, TextField, Box } from '@mui/material';

const ChatPage = () => {
	const [currentMessage, setCurrentMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const { userId } = useParams();

	const messagesRef = collection(firestore, 'chats');


	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
			if (user) {
				console.log("Oturum açan kullanıcı:", user);
				await fetchUserData(user.uid);
			} else {
				console.log("Kullanıcı oturum açmamış");
				setCurrentUser(null);
			}
		});

		return () => unsubscribeAuth();
	}, []);

	useEffect(() => {
		if (currentUser) {
			// Chat ID'yi oluşturmak için koşullu mantık yerine direkt olarak userID ve currentUser.coach'ı kullan
			const chatId = currentUser.role === 'coach' ? `${currentUser.id}-${userId}` : `${currentUser.coach}-${userId}`;
			const chatRef = doc(firestore, 'chats', chatId);
			const messagesRef = collection(chatRef, 'messages');
			const q = query(messagesRef, orderBy('timestamp', 'asc'));

			// Mesajları dinle
			const unsubscribeMessages = onSnapshot(q, (snapshot) => {
				const loadedMessages = snapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				// Filtreleme işlevini kaldır
				setMessages(loadedMessages);
			});

			return () => unsubscribeMessages();
		}
	}, [currentUser, userId]);

	const whoIsSender = () => {
		if (currentUser && currentUser.id == userId) {
			return "user";
		}
		else if (currentUser && currentUser.id != userId) {
			return "coach";
		}
	}

	const fetchUserData = async (userId) => {
		const userDocRef = doc(firestore, "users", userId);
		try {
			const userDocSnap = await getDoc(userDocRef);
			if (userDocSnap.exists()) {
				console.log("Kullanıcı verisi:", userDocSnap.data());
				setCurrentUser({ id: userDocSnap.id, ...userDocSnap.data() });
			} else {
				console.log("Kullanıcı verisi bulunamadı!");
				setCurrentUser(null);
			}
		} catch (error) {
			console.error("Kullanıcı verisi çekilirken hata oluştu:", error);
			setCurrentUser(null);
		}
	};

	const sendMessage = async (event) => {
		event.preventDefault();
		if (currentMessage.trim() !== '' && currentUser) {
			try {
				const chatId = currentUser.role === 'coach' ? `${currentUser.id}-${userId}` : `${currentUser.coach}-${userId}`;
				const chatRef = doc(firestore, 'chats', chatId);
				const messagesRef = collection(chatRef, 'messages');

				await addDoc(messagesRef, {
					sender: whoIsSender() === "coach" ? currentUser.id : userId,
					receiver: whoIsSender() === "coach" ? userId : currentUser.coach,
					message: currentMessage,
					timestamp: serverTimestamp(),
				});
				setCurrentMessage('');
			} catch (error) {
				console.error("Mesaj gönderilirken hata oluştu: ", error);
			}
		}
	};

	const renderMessage = (msg) => {
		const isSender = msg.sender === (currentUser && currentUser.id);
		const senderName = isSender ? currentUser.firstName : whoIsSender == "coach" ? "Antrenör" : "Danışan" || 'Bilinmeyen Kullanıcı';
		const messageClass = isSender ? 'message-sender' : 'message-receiver';

		return (
			<div key={msg.id} className={messageClass}>
				<p><b>{senderName}:</b> {msg.message}</p>
			</div>
		);
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", mt: "10vh" }}>
			<Paper elevation={3} style={{ margin: 'auto', minWidth: '60%', height: '80%', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column' }}>
				<div className="messages-container">
					{messages.map(msg => (
						<div
							key={msg.id}
							className={`message ${msg.sender === (currentUser && currentUser.id) ? 'sent' : 'received'}`}
						>
							<span className="message-content">{msg.message}</span>
						</div>
					))}
				</div>
				<form className="message-form" onSubmit={sendMessage}>
					<TextField
						type="text"
						value={currentMessage}
						onChange={(e) => setCurrentMessage(e.target.value)}
						placeholder="Mesajınızı yazın"
						variant="outlined"
						style={{ flexGrow: 1, marginRight: '10px' }}
					/>
					<Button type="submit" variant="contained" color="primary">Gönder</Button>
				</form>
			</Paper>
		</Box>

	);
};

export default ChatPage;
