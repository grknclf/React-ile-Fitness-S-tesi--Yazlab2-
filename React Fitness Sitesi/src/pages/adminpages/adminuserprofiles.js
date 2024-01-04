import React, { useEffect, useState } from 'react';
import { Grid, Divider, Button, TextField , Box} from "@mui/material";
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from '@firebase/firestore';
import { firestore } from '../../firebaseConfig';
import { useAuth } from '../../database/authprovider';
import { User } from '../../classes/user';



export function AdminEditPage() {
	const { currentUser } = useAuth();
	const { userId } = useParams();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const userDocRef = doc(firestore, "users", userId);
			const userDoc = await getDoc(userDocRef);
			if (userDoc.exists()){
				const userData = userDoc.data();
				setUser(new User(
					userDoc.id,
					userData.firstName, // firstName olarak değiştirildi
					userData.lastName,  // lastName olarak değiştirildi
					userData.birthDate,
					userData.gender,
					userData.email,
					userData.phoneNumber, // phoneNumber olarak değiştirildi
					userData.profilePicture, // profilePicture olarak değiştirildi
					userData.role,
					userData.status)
				);
			}
		};
		fetchUser();
	},[userId]);

	const handleChange = (event) => {
		const {name, value} = event.target;
		setUser((prevUser) => ({
			...prevUser,
			[name]: value
		}));
	}

	const handleUpdate = async () => {
		if (!user) return;
		const userRef = doc(firestore, "users", userId);
		try {
			await updateDoc(userRef, {
				"firstName": user.name,
				"lastName": user.surname,
				"birthDate": user.birthDate,
				"gender": user.gender,
				"email": user.email,
				"phoneNumber": user.phone,
				"role": user.role,
			});
			alert("Kullanıcı bilgileri güncellendi!")
		} catch (error) {
			alert("Güncelleme başarısız: " + error);
		}

	}

	if(!user)
		return (<p>Yükleniyor...</p>);
	if (!currentUser && currentUser.role != "admin")
		return (<p>Admin yetkiniz yok!</p>);
	return(
		<Box
			display="flex"
			minHeight="75vh"
			justifyContent="center"
			alignItems="center"
			flexDirection="column"
			sx={{
				width: "70%", height: "75%", backgroundColor: 'white',
				boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', borderRadius: '16px',
				ml: 10, mt: 8, mb: 10
			}}>
			<h1>Hesap Ayrıntılarını Güncelle</h1>
			<Grid container spacing={2} sx={{ ml: 4, mt: 5 }}>
				<Grid item xs={6}>
					<TextField name="name" variant="outlined" label={"İsim"} onChange={handleChange} defaultValue = {user.name} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="surname" variant="outlined" label={"Soyisim"} onChange={handleChange} defaultValue = {user.surname} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="email" variant="outlined" label={"Mail"} onChange={handleChange} defaultValue = {user.email} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="gender" variant="outlined" label={"Cinsiyet"} onChange={handleChange} defaultValue = {user.gender} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="phone" variant="outlined" label={"Telefon"} onChange={handleChange} defaultValue = {user.phone} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="birthDate" variant="outlined" label={"Doğum Tarihi"} onChange={handleChange} defaultValue = {user.birthDate} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="role" variant="outlined" label={"Rol"} onChange={handleChange} defaultValue = {user.role} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
			</Grid>
			<Divider />
			<Button variant="contained" sx={{ mt: 10 }} onClick={handleUpdate}>Güncelle</Button>
		</Box>
	);
}



/*
const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userId) {
            const userRef = doc(firestore, 'users', userId);
            getDoc(userRef).then((doc) => {
                if (doc.exists()) {
                    setUser(doc.data());
                }
            });
        }
    }, [userId]);

	const [profile, setProfile] = useState({
		firstName: '',
		lastName: '',
		email: '',
		birthDate: '',
		gender: '',
		phoneNumber: '',
		profilePicture: ''
	  });

	  // user nesnesinin değiştiğinde profil durumunu güncelle
	  useEffect(() => {
		if (user) {
		  setProfile({
			firstName: user.name || '',
			lastName: user.surname || '',
			email: user.email || '',
			birthDate: user.birthDate || '',
			gender: user.gender || '',
			phoneNumber: user.phone || '',
			profilePicture: user.pp || ''
		  });
		}
	  }, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfile(prevState => ({ ...prevState, [name]: value }));
	};

	const handleChanges = async () => {
		const userDocRef = doc(firestore, 'users', user.id); // 'user.id' kullanıcının doküman ID'si olmalı
		try {
			await updateDoc(userDocRef, {
				...profile
			});
			//await handleEmailChange(profile.email);
			alert('Kullanıcı bilgileri başarıyla güncellendi!');
			window.location.reload();
		} catch (error) {
			alert('Güncelleme sırasında bir hata oluştu: ', error.message);
		}
	}


	//Bu alan auth kısmında da maili değiştiriyor bu bi ister mi bilemedim bakmak lazım
	// const handleEmailChange = async (newEmail) => {
	// 	const auth = getAuth();
	// 	const user = auth.user;

	// 	try {
	// 	  await updateEmail(user, newEmail);
	// 	  // E-posta adresi başarıyla güncellendi
	// 	} catch (error) {
	// 	  // Hata işleme
	// 	  console.error("E-posta güncelleme hatası", error);
	// 	}
	//   }

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
				ml: 10, mt: 8, mb: 10
			}}>
			<h1>Hesap Ayrıntılarını Güncelle</h1>
			<Grid container spacing={2} sx={{ ml: 4, mt: 5 }}>
				<Grid item xs={6}>
					<TextField name="firstName" variant="outlined" label={user.name} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="lastName" variant="outlined" label={user.surname} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="email" variant="outlined" label={user.email} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="gender" variant="outlined" label={user.gender} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="phoneNumber" variant="outlined" label={user.phone} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="birthDate" variant="outlined" label={user.birthDate} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
			</Grid>
			<Divider />
			<Button variant="contained" sx={{ mt: 10 }} onClick={handleChanges}>Güncelle</Button>
		</Box>
	);


*/
