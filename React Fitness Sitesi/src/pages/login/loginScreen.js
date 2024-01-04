import '../../App.css';
import Button from '@mui/material/Button';
import { Login } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, firestore } from '../../firebaseConfig';
import { useAuth } from "../../database/authprovider";
import { doc, getDoc } from '@firebase/firestore';


export function LoginScreen() {
	const { currentUser } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [submittedValues, setSubmittedValues] = useState("");
	const handleUsernameChange = (event) => { setUsername(event.target.value) };
	const handlepasswordChange = (event) => { setPassword(event.target.value) };
	const handleSubmit = async () => {
		try {
			// Kullanıcı adı ve şifre ile giriş yapmayı dene
			const userCredential = await signInWithEmailAndPassword(auth, username, password)
			const user = userCredential.user;

			const userDoc = await getDoc(doc(firestore, "users", user.uid));
			if (!userDoc.exists()) {
				throw new Error("Kullanıcı verisi bulunamadı!")
			}
			const userData = userDoc.data();
			if (userData.status == "disabled") {
				alert("Hesabınız aktif değil!")
			} else if (userData.role == 'admin') {
				navigate('/admin')
			} else if (userData.role == 'coach') {
				navigate('/coach');
			} else {
				navigate('/menu');
			}
			// Giriş başarılı, e-posta doğrulaması kontrol ediliyor
			//if (userCredential.user.emailVerified) {
			//} else {
			// E-posta doğrulanmamış, hata mesajı göster
			//}
			// var document =  await getDoc(doc(firestore, "users", response.user.uid))
			// var role = document.data['role']
			// alert(role);
			// Giriş başarılı, /menu sayfasına yönlendir

		} catch (error) {
			console.error('Giriş başarısız: ', error);
			alert('Giriş başarısız: ', error)
		}
	};
	let navigate = useNavigate();

	const handleRegisterClick = () => {
		navigate("/signin"); // Kullanıcıyı kayıt sayfasına yönlendir
	};

	const handleForgotClick = () => {
		navigate("/forgot"); // Kullanıcıyı kayıt sayfasına yönlendir
	};

	useEffect(() => {
		if (auth.currentUser) {
			signOut(auth).then(() => {
				// Çıkış işlemi başarılı, istenirse burada ek işlemler yapılabilir.
				console.log("Kullanıcı çıkış yaptı.");
			}).catch((error) => {
				// Çıkış işlemi sırasında bir hata oluştu.
				console.error("Çıkış yapılırken hata oluştu: ", error);
			});
		}
	}, [auth]);

	const handleSubmitWithVerification = async () => {
		try {
			// Mevcut kullanıcı giriş işlemleri
			const userCredential = await signInWithEmailAndPassword(auth, username, password);
			const user = userCredential.user;

			// E-posta doğrulama kontrolü
			if (user.emailVerified) {
				const userDoc = await getDoc(doc(firestore, "users", user.uid));
			if (!userDoc.exists()) {
				throw new Error("Kullanıcı verisi bulunamadı!")
			}
			const userData = userDoc.data();
			if (userData.status == "disabled") {
				alert("Hesabınız aktif değil!")
			} else if (userData.role == 'admin') {
				navigate('/admin')
			} else if (userData.role == 'coach') {
				navigate('/coach');
			} else {
				navigate('/menu');
			}
			} else {
				alert("Lütfen e-posta adresinizi doğrulayın.");
			}
		} catch (error) {
			console.error('Giriş başarısız: ', error);
			alert('Giriş başarısız: ', error);
		}
	};


	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
			flexDirection="column"
			sx={{
				display: 'flex',
				justifyContent: "center",
				alignItems: "center",
				width: 500,
				height: 300,
				backgroundColor: '#2E303D',
				'&:hover': {
					boxShadow: '0px 10px 20px rgba(0,0,0,0.15)'
				}
			}}

		>
			<h1 style={{ color: 'white' }}>Fitness Sitesi</h1>
			<CustomizedTextField name="username" text="mail" value={username} onChange={handleUsernameChange} />
			<CustomizedTextField name="password" text="şifre" value={password} onChange={handlepasswordChange} />
			<Button
				variant="text"
				sx={{ color: 'white' }}
				onClick={handleForgotClick}
			>Şifremi unuttum</Button>
			<Button
				sx={{ backgroundColor: 'green', mb: 5 }}
				variant="contained"
				//color="secondary"
				startIcon={<Login />}
				onClick={handleSubmit}
			>Giriş Yap</Button>
			<Button
				variant="contained"
				onClick={handleSubmitWithVerification}
			>E-posta Doğrulanmış Giriş</Button>
			<Button
				variant="text"
				sx={{ color: 'white' }}
				onClick={handleRegisterClick}
			>Hesabınız yoksa kaydolun</Button>
			{submittedValues.username && <p>Kullanıcı Adı: {submittedValues.username}</p>}
			{submittedValues.password && <p>Şifre: {submittedValues.password}</p>}
		</Box>
	);


}



function CustomizedTextField(props) {
	return (
		<TextField
			type={props.name === "password" ? "password" : "text"}
			name={props.name}
			value={props.value}
			onChange={props.onChange}
			label={props.text}
			variant="outlined"
			sx={{
				width: '75%',
				mb: 2,
				'& .MuiInputBase-input': {
					color: 'white', // Input metin rengi
				},
				'& .MuiInputLabel-root': {
					color: 'white', // Label metin rengi
				},
				'& .MuiOutlinedInput-root': {
					'& fieldset': {
						borderColor: 'white', // Kenarlık rengi
					},
					'&:hover fieldset': {
						borderColor: 'white', // Üzerine gelindiğinde kenarlık rengi
					},
					'&.Mui-focused fieldset': {
						borderColor: 'white', // Odaklanıldığında kenarlık rengi
					},
				},
			}}></TextField>
	);
}

export default LoginScreen;
