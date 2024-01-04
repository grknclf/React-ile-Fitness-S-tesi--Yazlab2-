import React, { useState, useEffect } from "react";
import {
	Divider,
	Button,
	TextField,
	Box,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Select,
	MenuItem,
	Alert
} from "@mui/material";
import { auth, firestore } from "../firebaseConfig";
import { getDocs, query, collection, doc, getDoc, updateDoc, orderBy, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



export function CoachPage() {
	const checkUserRole = async (userId) => {
		const userDocRef = doc(firestore, "users", userId);
		const userDocSnap = await getDoc(userDocRef);

		return userDocSnap.data()?.role || null;
	};

	const [user, setUser] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const [activePanel, setActivePanel] = useState(1);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			setUser(authUser);

			if (authUser) {
				checkUserRole(authUser.uid).then((role) => setUserRole(role));
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	if (!user) {
        return <p style={{ textAlign: "center", color: "#1976D2" }}>Lütfen giriş yapın.</p>;
    }

    if (userRole !== "coach") {
        return (
            <Paper elevation={3} style={{ padding: "20px", backgroundColor: "#fff", textAlign: "center" }}>
                <Alert severity="warning" style={{ marginBottom: "20px" }}>
                    Coach yetkisine sahip değilsiniz!
                </Alert>
                <Typography variant="h6" color="textSecondary">
                    Bu sayfaya erişim izniniz bulunmamaktadır.
                </Typography>
            </Paper>
        );
    }

	const renderPanel = () => {
		switch (activePanel) {
			case 1:
				return <Panel1 userId={user.uid} />;
			case 2:
				return <Panel2 userId={user.uid} />;
			case 3:
				return <Panel3 userId={user.uid} />;
			case 4:
				return <Panel4 coachId={user.uid} />;
			// Diğer panelleri buraya ekleyebilirsiniz
			default:
				return null;
		}
	};

	return (
		<div style={{ padding: "20px", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
			{user ? (
				<Paper elevation={3} style={{ padding: "20px", backgroundColor: "#fff" }}>
					<h1 style={{ textAlign: "center", marginBottom: "20px", color: "#1976D2" }}>
						Hoş geldin, {user.email}!
					</h1>
					{userRole === "coach" ? (
						<div>
							<Grid container spacing={2} justifyContent="center">
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => setActivePanel(1)}
										style={{ color: "#1976D2", borderColor: "#1976D2" }}
									>
										Profil
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => setActivePanel(2)}
										style={{ color: "#1976D2", borderColor: "#1976D2" }}
									>
										Profil Güncelleme
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => setActivePanel(3)}
										style={{ color: "#1976D2", borderColor: "#1976D2" }}
									>
										Danışan Bilgileri
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => setActivePanel(4)}
										style={{ color: "#1976D2", borderColor: "#1976D2" }}
									>
										Atama İşlemleri
									</Button>
								</Grid>

								{/* Diğer butonları buraya ekleyebilirsiniz */}
							</Grid>
							<Divider style={{ margin: "20px 0", backgroundColor: "#1976D2" }} />
							{renderPanel()}
						</div>
					) : (
						<p style={{ textAlign: "center", color: "red" }}>
							Bu sayfaya erişim izniniz yok.
						</p>
					)}
				</Paper>
			) : (
				<p style={{ textAlign: "center", color: "#1976D2" }}>Lütfen giriş yapın.</p>
			)}
		</div>
	);
}

export const Panel1 = ({ userId }) => {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userDocRef = doc(firestore, "users", userId);
				const userDocSnap = await getDoc(userDocRef);
				setUserData(userDocSnap.data());
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, [userId]);

	return (
		<div>
			<h2 style={{ textAlign: "center", color: "#1976D2" }}>Panel 1</h2>
			{userData && (
				<div>
					<TableContainer component={Paper} elevation={3} style={{ margin: "20px 0" }}>
						<Table>

							<TableBody>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>{userData.firstName}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Surname</TableCell>
									<TableCell>{userData.lastName}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Email</TableCell>
									<TableCell>{userData.email}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Birth Date</TableCell>
									<TableCell>{userData.birthDate}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Gender</TableCell>
									<TableCell>{userData.gender}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Phone Number</TableCell>
									<TableCell>{userData.phoneNumber}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Role</TableCell>
									<TableCell>{userData.role}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Profession</TableCell>
									<TableCell>{userData.profession}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Experiences</TableCell>
									<TableCell>{userData.experiences}</TableCell>
								</TableRow>
								{/* Diğer bilgileri buraya ekleyebilirsiniz */}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}
		</div>
	);
};


export const Panel2 = ({ userId }) => {
	const [userData, setUserData] = useState(null);
	const [updatedFirstName, setUpdatedFirstName] = useState("");
	const [updatedLastName, setUpdatedLastName] = useState("");
	const [updatedEmail, setUpdatedEmail] = useState("");
	const [updatedBirthDate, setUpdatedBirthDate] = useState("");
	const [updatedGender, setUpdatedGender] = useState("");
	const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
	const [updatedRole, setUpdatedRole] = useState("");
	const [updatedProfession, setUpdatedProfession] = useState("");
	const [updatedExperiences, setUpdatedExperiences] = useState("");


	useEffect(() => {
		const fetchData = async () => {
			try {
				const userDocRef = doc(firestore, "users", userId);
				const userDocSnap = await getDoc(userDocRef);
				setUserData(userDocSnap.data());
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, [userId]);

	const updateUserDataInDatabase = async () => {
		try {
			const updatedData = {
				...userData,
				firstName: updatedFirstName || userData.firstName,
				lastName: updatedLastName || userData.lastName,
				email: updatedEmail || userData.email,
				birthDate: updatedBirthDate || userData.birthDate,
				gender: updatedGender || userData.gender,
				phoneNumber: updatedPhoneNumber || userData.phoneNumber,
				role: updatedRole || userData.role,
				profession: updatedProfession || userData.profession,
				experiences: updatedExperiences || userData.experiences,
			};

			const userDocRef = doc(firestore, "users", userId);
			await updateDoc(userDocRef, updatedData);
			setUserData(updatedData); // Yerel durumu güncelle
			setUpdatedFirstName(""); // Güncellendikten sonra input'u temizle
			setUpdatedLastName("");  // Güncellendikten sonra input'u temizle
			setUpdatedEmail("");  // Güncellendikten sonra input'u temizle
			setUpdatedBirthDate("");  // Güncellendikten sonra input'u temizle
			setUpdatedGender("");  // Güncellendikten sonra input'u temizle
			setUpdatedPhoneNumber("");  // Güncellendikten sonra input'u temizle
			setUpdatedRole("");  // Güncellendikten sonra input'u temizle
			setUpdatedProfession("");  // Güncellendikten sonra input'u temizle
			setUpdatedExperiences("");  // Güncellendikten sonra input'u temizle
		} catch (error) {
			console.error("Error updating user data:", error);
		}
	};

	return (
		<div>
			<h2 style={{ textAlign: "center", color: "#1976D2" }}>Panel 2</h2>
			{userData && (
				<div>
					<TableContainer component={Paper} elevation={3} style={{ margin: "20px 0" }}>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>{userData.firstName}</TableCell>
									<TableCell>
										<TextField
											label="New Name"
											value={updatedFirstName}
											onChange={(e) => setUpdatedFirstName(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Name</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Surname</TableCell>
									<TableCell>{userData.lastName}</TableCell>
									<TableCell>
										<TextField
											label="New Surname"
											value={updatedLastName}
											onChange={(e) => setUpdatedLastName(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Surname</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Email</TableCell>
									<TableCell>{userData.email}</TableCell>
									<TableCell>
										<TextField
											label="New Email"
											value={updatedEmail}
											onChange={(e) => setUpdatedEmail(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Email</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>BirthDate</TableCell>
									<TableCell>{userData.birthDate}</TableCell>
									<TableCell>
										<TextField
											label="New Birth Date"
											value={updatedBirthDate}
											onChange={(e) => setUpdatedBirthDate(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Birth Date</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Gender</TableCell>
									<TableCell>{userData.gender}</TableCell>
									<TableCell>
										<TextField
											label="New Gender"
											value={updatedGender}
											onChange={(e) => setUpdatedGender(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Gender</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>PhoneNumber</TableCell>
									<TableCell>{userData.phoneNumber}</TableCell>
									<TableCell>
										<TextField
											label="New Phone Number"
											value={updatedPhoneNumber}
											onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Phone Number</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Profession</TableCell>
									<TableCell>{userData.profession}</TableCell>
									<TableCell>
										<TextField
											label="New Profession"
											value={updatedProfession}
											onChange={(e) => setUpdatedProfession(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Profession</Button>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Experiences</TableCell>
									<TableCell>{userData.experiences}</TableCell>
									<TableCell>
										<TextField
											label="New Experiences"
											value={updatedExperiences}
											onChange={(e) => setUpdatedExperiences(e.target.value)}
										/>
										<Button onClick={updateUserDataInDatabase}>Update Experiences</Button>
									</TableCell>
								</TableRow>

								{/* Diğer bilgileri ve butonları buraya ekleyebilirsiniz */}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			)}
		</div>
	);
};

export const Panel3 = ({ userId }) => {
	let navigate = useNavigate();
	const [coachSubs, setCoachSubs] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Adım 1: Giriş yaptığınız kullanıcının "users" koleksiyonundaki belgesine erişim
				const userDocRef = doc(firestore, "users", userId);
				const userDocSnap = await getDoc(userDocRef);

				if (userDocSnap.exists()) {
					// Adım 2: "users" koleksiyonundaki belge içindeki "coachsubs" koleksiyonunu kontrol et
					const coachSubsCollectionRef = collection(userDocRef, "coachsubs");
					const coachSubsQuerySnapshot = await getDocs(coachSubsCollectionRef);

					const subsData = [];
					coachSubsQuerySnapshot.forEach((doc) => {
						subsData.push(doc.id);
					});

					// Adım 3: "users" koleksiyonundaki belgelerin içindeki id'leri kontrol et
					const usersCollectionRef = collection(firestore, "users");
					const usersQuerySnapshot = await getDocs(usersCollectionRef);

					const usersInfo = [];
					subsData.forEach(async (sub) => {
						const userIdFromCoachSubs = sub;

						usersQuerySnapshot.forEach((userDoc) => {
							if (userDoc.id === userIdFromCoachSubs) {
								usersInfo.push(userDoc.data());
							}
						});
					});

					setCoachSubs(usersInfo);
				}
			} catch (error) {
				console.error("Veri çekme hatası:", error);
			}
		};

		fetchData();
	}, [userId]);

	return (
		<div>
			<h2 style={{ textAlign: "center", color: "#1976D2" }}>Panel 3</h2>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Ad</TableCell>
							<TableCell>Soyad</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Cinsiyet</TableCell>
							<TableCell>Hedef</TableCell>
							<TableCell>Telefon</TableCell>
							<TableCell>Rol</TableCell>
							{/* İhtiyaca göre diğer alanları buraya ekleyebilirsiniz */}
						</TableRow>
					</TableHead>
				</Table>
			</TableContainer>
			{coachSubs.length > 0 ? (
				<div>
					{coachSubs.map((user, index) => (
						<Accordion key={index}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls={`panel${index + 1}a-content`}
								id={`panel${index + 1}a-header`}
							>
								<TableContainer component={Paper}>
									<Table>

										<TableBody>
											<TableRow>
												<TableCell>{user.firstName}</TableCell>
												<TableCell>{user.lastName}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>{user.gender}</TableCell>
												<TableCell>{user.goal}</TableCell>
												<TableCell>{user.phoneNumber}</TableCell>
												<TableCell>{user.role}</TableCell>
												<TableCell>
													<Button onClick={() => navigate(`/chat/${user.uid}`)}>Chat</Button>
												</TableCell>

											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</AccordionSummary>
							<AccordionDetails>
								<TableContainer component={Paper}>
									<Table>
										<TableHead>
											<TableRow>
											</TableRow>
										</TableHead>
										<TableBody>
											<Tab1 id={user.uid}></Tab1>
										</TableBody>
									</Table>
								</TableContainer>
							</AccordionDetails>
						</Accordion>
					))}
				</div>
			) : (
				<p style={{ textAlign: "center" }}>Veri bulunamadı.</p>
			)}
		</div>
	);
};

export const Panel4 = ({coachId}) => {
	const [users, setUsers] = useState([]);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [exercisePlans, setExercisePlans] = useState([]);
	const [nutritionPlans, setNutritionPlans] = useState([]);
	const [selectedExercisePlan, setSelectedExercisePlan] = useState('');
	const [selectedNutritionPlan, setSelectedNutritionPlan] = useState('');
	const [loading, setLoading] = useState(true);

	// Koçun kullanıcılarını yükle
	useEffect(() => {
		const loadUsers = async () => {
			if (!coachId) {
			  console.error('No coachId provided');
			  return;
			}

			try {
			  // coachsubs koleksiyonundaki tüm belgelerin ID'lerini çek
			  const coachSubsRef = collection(firestore, 'users', coachId, 'coachsubs');
			  const coachSubsSnapshot = await getDocs(coachSubsRef);
			  const coachSubsIds = coachSubsSnapshot.docs.map(doc => doc.id); // Kullanıcı ID'lerini al

			  // Kullanıcı ID'lerini kullanarak kullanıcı verilerini çek
			  const usersData = await Promise.all(coachSubsIds.map(async userId => {
				const userRef = doc(firestore, 'users', userId);
				const userSnap = await getDoc(userRef);
				return {
				  id: userId,
				  data: userSnap.exists() ? userSnap.data() : "No data",
				};
			  }));

			  setUsers(usersData);
			} catch (error) {
			  console.error('Error loading users:', error);
			}
		  };

	  const loadPlans = async () => {
		// Egzersiz planlarını yükle
		const exerciseRef = collection(firestore, 'exercise');
		const exerciseSnapshot = await getDocs(exerciseRef);
		setExercisePlans(exerciseSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));

		// Beslenme planlarını yükle
		const nutritionRef = collection(firestore, 'nutrition');
		const nutritionSnapshot = await getDocs(nutritionRef);
		setNutritionPlans(nutritionSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));

		setLoading(false);
	  };

	  loadUsers();
	  loadPlans();
	}, [coachId]);

	// Seçilen planları belirli bir kullanıcıya ata
	const assignPlans = async () => {
	  if (!selectedUserId || !selectedExercisePlan || !selectedNutritionPlan) {
		alert('Please select a user and plans.');
		return;
	  }

	  const exercisePlan = exercisePlans.find(plan => plan.id === selectedExercisePlan)?.data;
	  const nutritionPlan = nutritionPlans.find(plan => plan.id === selectedNutritionPlan)?.data;

	  await setDoc(doc(firestore, 'users', selectedUserId, 'exerciseandnutrition', 'exercise'), exercisePlan);
	  await setDoc(doc(firestore, 'users', selectedUserId, 'exerciseandnutrition', 'nutrition'), nutritionPlan);

	  alert('Plans assigned successfully.');
	};

	if (loading) {
	  return <div>Loading...</div>;
	}

	return (
	  <div>
		<Select
      value={selectedUserId}
      onChange={e => setSelectedUserId(e.target.value)}
      displayEmpty
      fullWidth
    >
      <MenuItem value=""><em>Danışan seç</em></MenuItem>
      {users.map(user => (
        <MenuItem key={user.id} value={user.id}>{user.data.firstName + " " + user.data.lastName}</MenuItem> // Burada sadece user ID'sini gösteriyoruz.
      ))}
    </Select>
		<Select
		  value={selectedExercisePlan}
		  onChange={e => setSelectedExercisePlan(e.target.value)}
		  displayEmpty
		  fullWidth
		>
		  <MenuItem value=""><em>Select Exercise Plan</em></MenuItem>
		  {exercisePlans.map(plan => (
			<MenuItem key={plan.id} value={plan.id}>{plan.id}</MenuItem>
		  ))}
		</Select>
		<Select
		  value={selectedNutritionPlan}
		  onChange={e => setSelectedNutritionPlan(e.target.value)}
		  displayEmpty
		  fullWidth
		>
		  <MenuItem value=""><em>Select Nutrition Plan</em></MenuItem>
		  {nutritionPlans.map(plan => (
			<MenuItem key={plan.id} value={plan.id}>{plan.id}</MenuItem>
		  ))}
		</Select>
		<Button onClick={assignPlans} variant="contained" color="primary">Plan ata</Button>
	  </div>
	);
}

export function Tab1(props) {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			// Kullanıcı ilerleme koleksiyonunu sorgula
			const q = query(collection(firestore, "users", props.id, "progress"), orderBy("date"));

			try {
				const querySnapshot = await getDocs(q);
				const progressData = querySnapshot.docs.map(doc => ({
					...doc.data(),
					id: doc.id // Eğer belge ID'si de gerekiyorsa
				}));
				setData(progressData);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchData();
	}, []);

	const renderLineChart = (dataKey, color, title, yaxis) => (
		<Paper elevation={3} sx={{ p: 2, m: 2, minWidth: 540, }}>
			<Typography variant="h6" gutterBottom>
				{title}
			</Typography>
			<LineChart width={490} height={250} data={data}>
				<XAxis dataKey="date" />
				<YAxis domain={['auto', yaxis]} />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey={dataKey} stroke={color} />
			</LineChart>
		</Paper>
	);
	return (

		<Box sx={{}}>
			<Grid container spacing={2} sx={{ ml: 4, mt: 5, }}>
				<Grid item xs={12} sm={6} md={4}>
					{renderLineChart("weight", "#8884d8", "Ağırlık", 3)}
				</Grid>
				<Grid item xs={12} sm={6} md={4} ml={"22vh"}>
					{renderLineChart("height", "#8884d8", "Ağırlık", 30)}
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					{renderLineChart("bodyfat", "#8884d8", "Vücut Yağ Oranı", 3)}
				</Grid>
				<Grid item xs={12} sm={6} md={4} ml={"22vh"}>
					{renderLineChart("muscle", "#8884d8", "Kas Kütlesi", 3)}
				</Grid>
				<Grid item xs={12} sm={6} md={4}>
					{renderLineChart("bmi", "#8884d8", "Vücut Kitle İndeksi", 3)}
				</Grid>
				<Grid item xs={12} sm={6} md={4} ml={"22vh"}>
					{renderLineChart("acalories", "#8884d8", "Alınan Kaloriler", 3)}
				</Grid>
				<Grid item xs={12} sm={6} md={4} ml={"40vh"}>
					{renderLineChart("vcalories", "#8884d8", "Verilen Kaloriler", 3)}
				</Grid>
			</Grid>
		</Box>
	);
}


//<Button onClick={() => navigate(`/chat/${user.uid}`)}>Chat</Button>
