import { Avatar, Divider, Button, TextField, ListItem, ListItemText, List } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import ResponsiveAppBar from "../../components/appbar";
import { useAuth } from "../../database/authprovider";
import Grid from '@mui/material/Grid';
import { firestore } from "../../firebaseConfig";
import { updateDoc, doc } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
//import { getAuth, updateEmail } from "firebase/auth";


//#2E303D

export function ProfilePage() {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <div>Loading...</div>; // veya başka bir yükleme göstergesi
	}

	return (
		<Box display="flex" flexDirection="column" sx={{ width: "100%", height: "100%", backgroundColor: 'white', }}>
			<ResponsiveAppBar name="deneme"></ResponsiveAppBar>
			<Box display="flex" flexDirection="row">
				{OldProfile(currentUser)}
				{EditProfile(currentUser)}
			</Box>
		</Box>
	);
}

// Aktif profil özellikleri

function OldProfile(currentUser) {
	const [selectedImage, setSelectedImage] = useState(null);

	const handleAvatarClick = () => {
		document.getElementById("imageInput").click();
	};

	const handleImageChange = async (e) => {
		if (e.target.files[0]) {
			setSelectedImage(e.target.files[0]);
			const imageRef = ref(storage, `images/${e.target.files[0].name}`);
			await uploadBytes(imageRef, e.target.files[0]).then(() => {
				getDownloadURL(imageRef).then(async (url) => {
					// Firestore'da kullanıcı profilini güncelle
					const userDocRef = doc(firestore, 'users', currentUser.id);
					await updateDoc(userDocRef, { profilePicture: url });

					// Arayüzde göstermek için URL'yi kaydet
					setSelectedImage(url);
				});
			});
		}
	};

	const style = {
		width: '100%',
		maxWidth: 360,
		bgcolor: 'background.paper',
		mb: 2
	};

	return (
		<Box display="flex" flexDirection="column" minHeight="75vh" sx={{
			width: "15%", height: "75%", justifyContent: "center", alignItems: "center", mt: 8, ml: 10, backgroundColor: 'white',
			boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', borderRadius: '16px'
		}}>
			<input
				type="file"
				id="imageInput"
				hidden
				onChange={handleImageChange}
			/>
			<Avatar sx={{ width: "40%", height: "40%", mt: 10, mb: 10 }}
				onClick={handleAvatarClick}
				src={selectedImage || currentUser.pp}
			></Avatar>
			<List sx={style} component="nav" aria-label="mailbox folders">
				<Divider />
				<ListItem button>
					<ListItemText primary={currentUser.name} />
				</ListItem>
				<Divider />
				<ListItem button divider>
					<ListItemText primary={currentUser.surname} />
				</ListItem>
				<ListItem button>
					<ListItemText primary={currentUser.email} />
				</ListItem>
				<Divider light />
				<ListItem button>
					<ListItemText primary={currentUser.gender} />
				</ListItem>
				<Divider light />
				<ListItem button>
					<ListItemText primary={currentUser.phone} />
				</ListItem>
				<Divider light />
				<ListItem button>
					<ListItemText primary={currentUser.birthDate} />
				</ListItem>
			</List>
		</Box>
	);
}

//Profil özelliklerini değiştirdiğimiz kısım

function EditProfile(currentUser) {
	const [profile, setProfile] = useState({
		firstName: '',
		lastName: '',
		email: '',
		birthDate: '',
		gender: '',
		phoneNumber: '',
		profilePicture: ''
	  });

	  // currentUser nesnesinin değiştiğinde profil durumunu güncelle
	  useEffect(() => {
		if (currentUser) {
		  setProfile({
			firstName: currentUser.name || '',
			lastName: currentUser.surname || '',
			email: currentUser.email || '',
			birthDate: currentUser.birthDate || '',
			gender: currentUser.gender || '',
			phoneNumber: currentUser.phone || '',
			profilePicture: currentUser.pp || ''
		  });
		}
	  }, [currentUser]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setProfile(prevState => ({ ...prevState, [name]: value }));
	};

	const handleChanges = async () => {
		const userDocRef = doc(firestore, 'users', currentUser.id); // 'currentUser.id' kullanıcının doküman ID'si olmalı
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
	// 	const user = auth.currentUser;

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
					<TextField name="firstName" variant="outlined" label={currentUser.name} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="lastName" variant="outlined" label={currentUser.surname} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="email" variant="outlined" label={currentUser.email} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="gender" variant="outlined" label={currentUser.gender} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="phoneNumber" variant="outlined" label={currentUser.phone} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
				<Grid item xs={6}>
					<TextField name="birthDate" variant="outlined" label={currentUser.birthDate} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
				</Grid>
			</Grid>
			<Divider />
			<Button variant="contained" sx={{ mt: 10 }} onClick={handleChanges}>Güncelle</Button>
		</Box>
	);


}
