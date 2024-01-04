import { getDocs, collection, doc, setDoc, updateDoc } from "@firebase/firestore";
import { Add } from "@mui/icons-material";
import { Button, List, ListItem, ListItemText, Divider, Box, Fab } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../database/authprovider";
import { firestore } from "../../firebaseConfig";


export function AdminMenu() {
	const [users, setUsers] = useState([]);
	const { currentUser } = useAuth();
	let navigate = useNavigate();

	useEffect(() => {
		const getUsers = async () => {
			const querySnapshot = await getDocs(collection(firestore, 'users'));
			const userArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setUsers(userArray);
		};
		getUsers();
	}, []);

	const navigateToUserEdit = (userId) => {
		navigate(`/adminedit/${userId}`); // Örnek URL yapısı
	};

	const enableClick = async (event, userId) => {
		event.stopPropagation();
		const userRef = doc(firestore, "users", userId);
		await updateDoc(userRef, {
			status: "enabled"
		});
	};

	const disableClick = async (event, userId) => {
		event.stopPropagation();
		const userRef = doc(firestore, "users", userId);
		await updateDoc(userRef, {
			status: "disabled"
		});
	};


	if (!currentUser) {
		return (<p>yükleniyor...</p>)
	}
	if (!(currentUser.role == 'admin')) {
		return (<h1>Admin yetkisine sahip değilsiniz!</h1>);
	}
	return (

		<Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
			<Box display="flex" flexDirection="column" minHeight="75vh" sx={{
				width: "75%", height: "75%", justifyContent: "center", alignItems: "center", mt: 8, backgroundColor: 'white',
				boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', borderRadius: '16px'
			}}> <List component="nav" aria-label="mailbox folders" sx={{ width: "100%" }}>
					{users.map((user, index) => (
						<React.Fragment key={index}>
							<ListItem button onClick = {() => navigateToUserEdit(user.id)}>
								<ListItemText primary={user.email} />
								<Button variant="contained" onClick ={(event) => enableClick(event, user.id)} sx={{ mr: "1%" }}>Enable</Button>
								<Button variant="outlined" onClick ={(event) => disableClick(event, user.id)}>Disable</Button>
							</ListItem>
							<Divider />
						</React.Fragment>
					))}
				</List>
			</Box>
			<Fab color="primary" aria-label="add" sx={{ml: "88%"}} onClick = {() => navigate("/createuser")}>
				<Add />
			</Fab>
		</Box>

	);
}
