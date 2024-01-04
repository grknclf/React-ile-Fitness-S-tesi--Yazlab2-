import './App.css';
import RandomImage from './pages/login/randomImage';
import LoginScreen from './pages/login/loginScreen';
import { Box } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/login/register';
import { SomeComponent } from './pages/userpages/umainmenu';
import { AuthProvider } from './database/authprovider';
import { ForgotScreen } from './pages/login/forgotpass';
import { ProfilePage } from './pages/userpages/profile';
import { AdminMenu } from './pages/adminpages/adminmenu';
import { AdminEditPage } from './pages/adminpages/adminuserprofiles';
import { CreateUser } from './pages/adminpages/admincreateuser';
import ChatPage from './pages/userpages/chatpage';
import { CoachPage } from './coachpages/coachmenu';

<meta name="viewport" content="initial-scale=1, width=device-width" />


function App() {

  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="" element={
          <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '100vh' }}>
            <RandomImage/>
            <LoginScreen />
          </Box>
        } />
        <Route path="/signin" element={<Register />} />
        <Route path="/menu" element={<SomeComponent />} />
        <Route path="/forgot" element={<ForgotScreen />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminMenu />} />
        <Route path="/adminedit/:userId" element={<AdminEditPage />} />
        <Route path="/createuser" element={<CreateUser />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}


export default App;
