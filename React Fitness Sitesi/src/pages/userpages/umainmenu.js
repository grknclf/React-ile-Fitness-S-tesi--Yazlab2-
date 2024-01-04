import Button from '@mui/material/Button';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import ResponsiveAppBar from '../../components/appbar';
import { Paper, List, ListItem, ListItemText, Divider, Typography, Tabs, Tab, Grid, TextField, Fab, ListItemIcon, Card, CardContent, Avatar } from '@mui/material';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from '@firebase/firestore';
import { auth, firestore } from '../../firebaseConfig';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ChatIcon from '@mui/icons-material/Chat';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ScaleIcon from '@mui/icons-material/Scale';
import ShieldIcon from '@mui/icons-material/Shield';

export const SomeComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  let navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [meals, setMeals] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });

  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserData(user.uid);
        await getNutritionData(user.uid);
        await getExerciseData(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const userDocRef = doc(firestore, "users", userId);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        console.log("Kullanıcı verisi:", userDocSnap.data());
        // Burada kullanıcı verileriyle istediğiniz işlemleri yapabilirsiniz.
      } else {
        console.log("Kullanıcı verisi bulunamadı!");
      }
    } catch (error) {
      console.error("Kullanıcı verisi çekilirken hata oluştu:", error);
    }
  };

  const getNutritionData = async (userId) => {
    console.log('currentUser var, uid:', userId); // Kontrol için
    try {
      const nutritionRef = doc(firestore, "users", userId, "exerciseandnutrition", "nutrition");
      const nutritionSnap = await getDoc(nutritionRef);

      console.log('getDoc çalıştı, snapshot:', nutritionSnap); // Kontrol için

      if (nutritionSnap.exists()) {
        console.log('Snapshot mevcut, data:', nutritionSnap.data()); // Kontrol için
        setMeals(nutritionSnap.data());
        // alert("güncellendi"); // bu kısım gpt buraya bak
      } else {
        console.log("Beslenme bilgisi bulunamadı!"); // Kontrol için
      }
    } catch (error) {
      console.error("Veritabanı okuma hatası:", error); // Hata mesajı
    }
  };

  const getExerciseData = async (userId) => {
    console.log('currentUser var, uid:', userId); // Kontrol için
    try {
      const exerciseRef = doc(firestore, "users", userId, "exerciseandnutrition", "exercise");
      const exerciseSnap = await getDoc(exerciseRef);

      console.log('getDoc çalıştı, snapshot:', exerciseSnap); // Kontrol için

      if (exerciseSnap.exists()) {
        const exerciseData = exerciseSnap.data().exercise;
        console.log('Snapshot mevcut, data:', exerciseSnap.data()); // Kontrol için
        if (exerciseData) {
          setExercises(exerciseData.split(","));

        }
        else {
          setExercises([]);
        }
        // alert("güncellendi"); // bu kısım gpt buraya bak
      } else {
        console.log("Beslenme bilgisi bulunamadı!"); // Kontrol için
      }
    } catch (error) {
      console.error("Veritabanı okuma hatası:", error); // Hata mesajı
    }
  };

  if (!currentUser) {
    return (<p>Yükleniyor...</p>);
  }

  const VideoPlayer = ({ url }) => {
    // YouTube video ID'sini URL'den ayıklama
    const videoId = url.split('v=')[1].split('&')[0];

    // YouTube embed URL'si oluşturma
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>
    );
  };


  const isVideoURL = (str) => {
    var pattern = new RegExp('^Video:', 'i');
    return pattern.test(str);
  };


  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      mb={"8vh"}>
      <ResponsiveAppBar name="deneme"></ResponsiveAppBar>
      <Paper elevation={6} sx={{
        width: '90%',
        mt: "5%",
        borderRadius: 4, // Yuvarlak köşeler
        boxShadow: 3, // Gölge efekti
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column", width: "100%" }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column", width: "100%" }}>
            <Tabs sx={{ minWidth: "100%" }} value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab sx={{ minWidth: "25%" }} label="Hedef Seçimi" />
              <Tab sx={{ minWidth: "25%" }} label="İlerleme Görüntüleme" />
              <Tab sx={{ minWidth: "25%" }} label="Günlük Rutin" />
              <Tab sx={{ minWidth: "25%" }} label="İlerleme Ekleme" />
            </Tabs>
            {selectedTab === 0 && (
              <Tab0 userId={currentUser.uid}></Tab0>
            )}
            {selectedTab === 1 && (
              <Tab1 id={currentUser.uid}></Tab1>
            )}
            {selectedTab === 2 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column", mt: 2, minWidth: "100%" }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: "column", minWidth: "100%" }}>
                  <Paper elevation={3} sx={{ width: '100%', minWidth: "100%", maxHeight: "5%" }}>
                    <Typography variant="h5" component="div" sx={{ p: 2 }}>
                      Günlük Rutin
                    </Typography>
                  </Paper>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: "row", p: 4, minWidth: "50%" }}>
                  <Paper elevation={3} sx={{ width: '100%', minWidth: "50%" }}>
                    <Divider />
                    <Typography variant="h6" component="div" sx={{ mt: 2, ml: 2, mb: 2 }}>
                      Egzersizler
                    </Typography>
                    <Divider />
                    <List component="nav" aria-label="daily exercises">
                      {exercises.map((exercise, index) => (
                        <ListItem key={index}>
                          {isVideoURL(exercise) ? (
                            <VideoPlayer url={exercise} />
                          ) : (
                            <ListItemText primary={exercise} />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                  <Paper elevation={3} sx={{ width: '100%', minWidth: "50%", ml: "5%" }}>
                    <Typography variant="h6" component="div" sx={{ mt: 2, ml: 2, mb: 2 }}>
                      Beslenme
                    </Typography>
                    <Divider />
                    <List component="nav" aria-label="daily meals">
                      <ListItem>
                        <ListItemText primary={`Kahvaltı: ${meals.breakfast}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Öğle Yemeği: ${meals.lunch}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Akşam Yemeği: ${meals.dinner}`} />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>
              </Box>
            )}
            {selectedTab === 3 && (
              <Tab3 id={currentUser.uid}></Tab3>
            )}


          </Box>
        </Box>
      </Paper>

      <div style={{ position: 'fixed', bottom: 16, right: 16 }}> {/* Konumlandırma için stil */}
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => navigate(`/chat/${currentUser.uid}`)}
        >
          <ChatIcon /> {/* İkon ekleme */}
        </Fab>
      </div>
    </Box>
  );
};

export function Tab0(props) {
  const currentUserId = props.userId; // Kullanıcı ID'si props olarak alınır
  const [selectedCoach, setSelectedCoach] = useState(null);

  const fetchCurrentCoach = async (coachId) => {
    try {
      const coachRef = doc(firestore, "users", coachId);
      const coachSnap = await getDoc(coachRef);

      if (coachSnap.exists()) {
        return { id: coachSnap.id, ...coachSnap.data() };
      } else {
        console.log("Koç bulunamadı.");
        return null;
      }
    } catch (error) {
      console.error("Koçu alırken hata oluştu:", error);
      return null;
    }
  };

  useEffect(() => {
    const getUserAndCoach = async () => {
      const userRef = doc(firestore, "users", currentUserId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().coach) {
        // Kullanıcının atanmış bir koçu varsa bu koçu getir
        const currentCoach = await fetchCurrentCoach(userSnap.data().coach);
        setSelectedCoach(currentCoach);
      }
    };

    getUserAndCoach();
  }, [currentUserId]);

  const assignCoach = async (expertiseArea) => {
    try {
      // Mevcut koç bilgisini al
      const currentUserRef = doc(firestore, "users", currentUserId);
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserData = currentUserDoc.data();

      // Eğer mevcut bir koç varsa, onun 'coachsubs' koleksiyonundan bu kullanıcıyı çıkar
      if (currentUserData.coach) {
        const previousCoachSubDocRef = doc(firestore, "users", currentUserData.coach, "coachsubs", currentUserId);
        await deleteDoc(previousCoachSubDocRef);
      }

      // Koçları sorgula
      const coachesRef = collection(firestore, "users");
      const q = query(coachesRef, where("role", "==", "coach"), where("profession", "==", expertiseArea));
      const querySnapshot = await getDocs(q);

      let coaches = [];
      for (const doc of querySnapshot.docs) {
        const coachSubsRef = collection(firestore, "users", doc.id, "coachsubs");
        const subSnapshot = await getDocs(coachSubsRef);
        if (subSnapshot.size < 5) {
          coaches.push({ id: doc.id, ...doc.data() });
        }
      }

      if (coaches.length > 0) {
        // Rastgele bir koç seç
        const randomIndex = Math.floor(Math.random() * coaches.length);
        const selectedCoach = coaches[randomIndex];
        setSelectedCoach(selectedCoach);

        // Kullanıcının 'coach' alanını güncelle
        await updateDoc(currentUserRef, {
          coach: selectedCoach.id
        });

        // Koçun 'coachsubs' koleksiyonuna mevcut kullanıcının ID'sini ekle
        const coachSubDocRef = doc(firestore, "users", selectedCoach.id, "coachsubs", currentUserId);
        await setDoc(coachSubDocRef, {
          // Eklemek istediğiniz diğer veriler
        });

        console.log("Koç atandı ve abonelik eklendi:", selectedCoach.id);
      } else {
        console.log("Uygun koç bulunamadı.");
        setSelectedCoach(null);
      }
    } catch (error) {
      console.error("Koç atanırken hata oluştu:", error);
      setSelectedCoach(null);
    }
  };

  const updateGoalAndAssignCoach = async (newGoal) => {
    try {
      // Hedefi güncelle
      const userRef = doc(firestore, "users", currentUserId);
      await updateDoc(userRef, {
        goal: newGoal
      });

      // Koç ata ve abonelik ekle
      await assignCoach(newGoal);

      console.log("Hedef ve koç güncellendi:", newGoal);
    } catch (error) {
      console.error("Hedef ve koç güncellenirken hata oluştu:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Box sx={{ minWidth: "30%", display: "flex", flexDirection: "column", alignItems: "center", ml: "5vh", }}>
        <List sx={{ width: "100%" }} component="nav" aria-label="mailbox folders">
          <Divider />
          <ListItem sx={{ height: "10vh" }} button onClick={() => updateGoalAndAssignCoach("Kilo Alma")}>
            <ListItemIcon>
              <ScaleIcon />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: "center" }} primary={"Kilo Alma"} />
          </ListItem>
          <Divider />
          <ListItem sx={{ height: "10vh" }} button divider onClick={() => updateGoalAndAssignCoach("Kilo Verme")}>
            <ListItemIcon>
              <FitnessCenterIcon />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: "center" }} primary={"Kilo Verme"} />
          </ListItem>
          <ListItem sx={{ height: "10vh" }} button onClick={() => updateGoalAndAssignCoach("Kiloyu Koruma")}>
            <ListItemIcon>
              <ShieldIcon />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: "center" }} primary={"Kiloyu Koruma"} />
          </ListItem>
          <Divider light />
          <ListItem sx={{ height: "10vh" }} button onClick={() => updateGoalAndAssignCoach("Kas Kazanma")}>
            <ListItemIcon>
              <FitnessCenterIcon />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: "center" }} primary={"Kas Kazanma"} />
          </ListItem>
          <Divider light />
        </List>
      </Box>
      <Box sx={{ minWidth: "65%", p: 2 }}>
        <CoachCard coach={selectedCoach} />
      </Box>
    </Box>
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
          {renderLineChart("weight", "#8884d8", "Ağırlık", 120)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} ml={"22vh"}>
          {renderLineChart("height", "#8884d8", "Boy", 200)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderLineChart("bodyfat", "#8884d8", "Vücut Yağ Oranı", 100)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} ml={"22vh"}>
          {renderLineChart("muscle", "#8884d8", "Kas Kütlesi", 50)}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderLineChart("bmi", "#8884d8", "Vücut Kitle İndeksi", 60)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} ml={"22vh"}>
          {renderLineChart("acalories", "#8884d8", "Alınan Kaloriler", 5000)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} ml={"40vh"}>
          {renderLineChart("vcalories", "#8884d8", "Verilen Kaloriler", 5000)}
        </Grid>

      </Grid>
    </Box>
  );
}


export function Tab3(props) {
  const [progress, setProgress] = useState({
    height: 0,
    weight: 0,
    bodyfat: 0,
    muscle: 0,
    bmi: 0,
    acalories: 0,
    vcalories: 0,
    date: 0,
  });

  useEffect(() => {
    const fetchLatestProgress = async () => {
      try {
        const q = query(
          collection(firestore, "users", props.id, "progress"),
          orderBy("date", "desc"), // Tarihe göre en yeni veriden en eskiye sırala
          limit(1) // Yalnızca en yeni dokümanı getir
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestProgress = querySnapshot.docs[0].data();
          setProgress(latestProgress);
        } else {
          console.log("Veri bulunamadı!");
        }
      } catch (error) {
        console.error("Veritabanı okuma hatası:", error);
      }
    };

    fetchLatestProgress();
  }, [props.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProgress(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const progressRef = collection(firestore, "users", props.id, "progress");
      const newProgressDoc = await addDoc(progressRef, {
        ...progress, // Tarih otomatik olarak ekleniyor
      });
      console.log("Yeni bilgiler eklendi, doküman ID'si:", newProgressDoc.id);
    } catch (error) {
      console.error("Veritabanı yazma hatası:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", maxWidth: "100%", minWidth: "90%" }}>
      <Box sx={{ display: "flex", flexDirection: "row", maxWidth: "50%", minWidth: "30%", width: "40%" }}>
        <Paper elevation={3} sx={{ width: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Son Gelişme
          </Typography>
          <List>
            <List component="nav" aria-label="daily meals">
              <ListItem>
                <ListItemText primary={`Boy: ${progress.height}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Kilo: ${progress.weight}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Vücut yağ oranı: ${progress.bodyfat}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Kas kütlesi: ${progress.muscle}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Vücut kütle indeksi: ${progress.bmi}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Alınan kalori: ${progress.acalories}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Yakılan kalori: ${progress.vcalories}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Tarih: ${progress.date}`} />
              </ListItem>
            </List>
          </List>
        </Paper>

      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", maxWidth: "70%", minWidth: "70%", width: "70%" }}>
        <Paper elevation={3} sx={{ width: '100%', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Gelişme Güncelle
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField name="height" variant="outlined" label={"Boy"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="weight" variant="outlined" label={"Kilo"} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="bodyfat" variant="outlined" label={"Vücut yağ oranı"} onChange={handleChange} sx={{ width: "90%" }}>xs=4</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="muscle" variant="outlined" label={"Kas kütlesi"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="bmi" variant="outlined" label={"Vücut kitle indeksi"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="acalories" variant="outlined" label={"Alınan kalori"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="vcalories" variant="outlined" label={"Verilen kalori"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField name="date" variant="outlined" label={"yyyy-aa-gg"} onChange={handleChange} sx={{ width: "90%" }}>xs=8</TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Güncelle
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export function CoachCard({ coach }) {
  if (!coach) {
    return <Box sx={{ display: "flex", p: 2, minHeight: "30vh", alignItems: "center", justifyContent: "center" }}>
    <Paper sx={{ minWidth: "100%", minHeight: "30vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ textAlign: "center" }}>
        <h2>Koç ataması için hedefinizi seçmelisiniz!</h2>
      </Box>
    </Paper>
  </Box>;
  }

  return (
    <Card sx={{ minWidth: "70%", m: 2, minHeight: "40vh", display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
            {/* Burada antrenörün fotoğrafı olabilir, şimdilik varsayılan avatar */}
          </Avatar>
          <Typography variant="h5">{coach.firstName + " " + coach.lastName}</Typography>
        </CardContent>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">Uzmanlık Alanı: {coach.profession}</Typography>
          <Typography variant="body1">Uzmanlık: {coach.experiences}</Typography>
        </CardContent>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">Mail: {coach.email}</Typography>
          <Typography variant="body1">Cinsiyet: {coach.gender}</Typography>
          <Typography variant="body1">Telefon No: {coach.phoneNumber}</Typography>
        </CardContent>
      </CardContent>
    </Card>
  );
}
