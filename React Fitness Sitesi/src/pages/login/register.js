import React, { useState } from 'react';
import { TextField, Button, Avatar, Typography, Paper, Grid } from '@mui/material';
import { auth, firestore } from '../../firebaseConfig';
import { Box } from '@mui/system';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Register = () => {
	const [user, setUser] = useState({
		firstName: '',
		lastName: '',
		birthDate: '',
		gender: '',
		email: '',
		password: '',
		phoneNumber: '',
		profilePicture: '',
		role: '',
		status: '',
		coach: '',
	});

	let navigate = useNavigate();

	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await createUserWithEmailAndPassword(auth, user.email, user.password);
			await sendEmailVerification(response.user);

			const { password, ...userWithoutPassword } = user;

			await setDoc(doc(firestore, "users", response.user.uid), {
				...userWithoutPassword,
				uid: response.user.uid,
				role: "user",
				status: "enable"
			});

			const propertiesRef = doc(firestore, "users", response.user.uid, "progress", "userprogress");
			await setDoc(propertiesRef, {
				date: new Date().toISOString().split('T')[0],
				bmi: 0,
				bodyfat: 0,
				height: 0,
				muscle: 0,
				weight: 0,
				acalories: 0,
				vcalories: 0,
			});

			const propertiesRef2 = doc(firestore, "users", response.user.uid, "exerciseandnutrition", "exercise");
			await setDoc(propertiesRef2, {
				exercise: "",
			});

			const propertiesRef3 = doc(firestore, "users", response.user.uid, "exerciseandnutrition", "nutrition");
			await setDoc(propertiesRef3, {
				breakfast: "",
				lunch: "",
				dinner: "",
			});

			navigate("/");
			window.location.reload();
		} catch (error) {
			console.error('Error adding user: ', error);
		}
	};

	return (
		<Grid
			container
			justifyContent="center"
			alignItems="center"
			height="100vh"

			sx={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}
		>
			<Grid item xs={12} sm={8} md={6} lg={4}>
				<Paper
					elevation={3}
					sx={{
						padding: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						backgroundColor: 'white',
						color: 'white',
					}}
				>
					<Avatar sx={{ mb: 2, backgroundColor: 'green' }}>
						<FitnessCenterIcon />
					</Avatar>
					<Typography variant="h5" mb={3} sx={{ color: 'black' }}>
						Aramıza Hoşgeldin!
					</Typography>

					<TextField
						label="Ad"
						name="firstName"
						onChange={handleChange}
						fullWidth
						mb={50}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>
					<TextField
						label="Soyad"
						name="lastName"
						onChange={handleChange}
						fullWidth
						mb={20}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>
					<TextField
						label="Doğum Tarihi"
						name="birthDate"
						onChange={handleChange}
						fullWidth
						mb={5}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>
					<TextField
						label="Cinsiyet"
						name="gender"
						onChange={handleChange}
						fullWidth
						mb={5}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>
					<TextField
						label="E-posta"
						name="email"
						onChange={handleChange}
						fullWidth
						mb={5}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>
					<TextField
						label="Şifre"
						name="password"
						onChange={handleChange}
						fullWidth
						mb={5}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>
					<TextField
						label="Telefon Numarası"
						name="phoneNumber"
						onChange={handleChange}
						fullWidth
						mb={5}
						sx={{
							backgroundColor: 'white',
							color: 'black',
							'& .MuiInputBase-root': {
								color: 'black',
								borderRadius: '20px',
							},
						}}
					/>
					<Box mb={'2vh'}></Box>

					<Button
						variant="contained"
						onClick={handleSubmit}
						fullWidth
						sx={{
							backgroundColor: 'green',
							mt: 2,
							'&:hover': { backgroundColor: 'darkgreen' },
							color: 'white',
						}}
					>
						Kayıt Ol
					</Button>
				</Paper>
			</Grid>
		</Grid>
	);

};

export default Register;
