import { collection, doc, setDoc } from "@firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../database/authprovider";
import { Grid, Divider, Button, TextField, Box } from "@mui/material";
import { firestore } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { useNavigate } from "react-router";

export function CreateUser() {
	const { currentUser } = useAuth();
	let navigate = useNavigate();
	const [user, setUser] = useState({
		name: '',
		surname: '',
		birthDate: '',
		gender: '',
		email: '',
		phone: '',
	});

	const handleChange = (event) => {
		const { name, value } = event.target
		setUser(prevUser => ({
			...prevUser,
			[name]: value
		}));
	}

	const handleCreate = async () => {
		if (!user) return;
		const auth = getAuth();
		createUserWithEmailAndPassword(auth, user.email, "123456")
			.then((userCredential) => {
				// Kullanıcı oluşturuldu
				const currentUser = userCredential.user;
				const userRef = doc(collection(firestore, "users"), currentUser.uid);
				setDoc(userRef, {
					"firstName": user.name,
					"lastName": user.surname,
					"birthDate": user.birthDate,
					"gender": user.gender,
					"email": user.email,
					"phoneNumber": user.phone,
					"role": "user"
				})
					.then(() => {
						console.log("Kullanıcı Firestore'a eklendi");
						navigate("/");
					})
					.catch((error) => {
						console.error("Firestore'a kayıt başarısız: ", error);
					});
			})
			.catch((error) => {
				// Hata işleme
				console.error("Kullanıcı oluşturulamadı: ", error);
			});
		// try {
		// 	await setDoc(doc(collection(firestore, "users")), {
		// 		"firstName": user.name,
		// 		"lastName": user.surname,
		// 		"birthDate": user.birthDate,
		// 		"gender": user.gender,
		// 		"email": user.email,
		// 		"phoneNumber": user.phone,
		// 	});
		// 	alert("Kullanıcı oluşturuldu!")
		// } catch (error) {
		// 	alert("Kullanıcı oluşturma başarısız: " + error);
		// }
	}


	if (currentUser && currentUser.role != "admin")
		return (<p>Admin yetkisine sahip değilsiniz!</p>);
	return (
		<Box
			display="flex"
			minHeight="75vh"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			sx={{
				width: "70%", height: "75%", backgroundColor: 'white',
				boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', borderRadius: '16px',
				ml: "15%", mt: 8, mb: 10
			}}>
			<h1>Kullanıcı Oluştur</h1>
			<Grid container spacing={2} sx={{ ml: 4, mt: 5 }}>
				<Grid item xs={6}>
					<TextField name="name" variant="outlined" label={"İsim"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="surname" variant="outlined" label={"Soyisim"} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="email" variant="outlined" label={"Mail"} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="gender" variant="outlined" label={"Cinsiyet"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="phone" variant="outlined" label={"Telefon"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="birthDate" variant="outlined" label={"Doğum Tarihi"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
			</Grid>
			<Divider />
			<Button variant="contained" sx={{ mt: 10 }} onClick={handleCreate}>Oluştur</Button>
		</Box>
	);
}
