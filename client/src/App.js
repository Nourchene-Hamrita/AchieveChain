import { useState, useEffect } from 'react';
import './App.css';
import { Menu, Divider } from 'semantic-ui-react';
import web3Connection from './web3Connection';
import Contract from './AuthContract';
import Formate from './utils/Formate'
import Home from './components/home/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import NavBar from './components/navBar/NavBar';
import SideBar from './components/sideBar/SideBar';
import CoursesPage from './pages/CoursesPage/CoursesPage';
import SignIn from './components/signIn/SignIn';
import SignUp from './components/signUp/SignUp';
import Bagdes from './components/badges/Badges';
import Badges from './components/badges/Badges';
import BadgesPage from './pages/BadgesPage/BagdesPage';
import BadgeList from './components/badges/BadgeList';
import BadgesRoutes from './routes/BadgesRoutes';
import CompetenciesRoutes from './routes/CompetenciesRoutes';
import Grades from './components/grades/Grades';
import GradesRoutes from './routes/GradesRoutes';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [activeItem, setActiveItem] = useState('home');
  const [signedUp, setSignedUp] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const user = localStorage.getItem("loggedIn");

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await web3Connection();
        const contract = await Contract(web3);
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setContract(contract);
        setAccount(accounts[0]);
        start();
      } catch (error) {
        alert(`Failed to load web3`);
        console.error(error);
      }
      getAccount();
    };
    init();
  }, []);

  const start = async () => {
    await getAccount();
    console.log("web3 =", web3);
    console.log("Contract =", contract);
    console.log("Account =", account);
  };

  const getAccount = async () => {
    if (web3 !== null || web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        setAccount(accounts[0]);
        setLoggedIn(false);
        web3.eth.getBalance(accounts[0], (err, balance) => {
          if (!err) {
            setBalance(Formate(web3.utils.fromWei(balance, 'ether')));
          }
        });
      });
    }
  }

  const accountCreated = async (signedUp) => {
    setSignedUp(signedUp);
  }

  const userSignedIn = async (loggedIn, username) => {
    setLoggedIn(loggedIn);
    setUsername(username);
  }

  const loggedOut = async (loggedIn) => {
    setLoggedIn(loggedIn);
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  else if (user) {
    return (
      <div className="app">
        <Router>
          <NavBar />
          <div className="container">
            <SideBar />
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="badges/*" element={<BadgesRoutes />} />
              <Route path="competencies/*" element={<CompetenciesRoutes />} />
              <Route path="grades/*" element={<GradesRoutes />} />
            </Routes>

          </div>
        </Router>
      </div>
    );

  } else {
    return (
      <div className="app">
        <Router>
          <div className="container">
            <Routes>
              <Route path="/sign-in" element={<SignIn web3={web3}
                contract={contract}
                account={account}
                signedUp={signedUp}
                userSignedIn={userSignedIn} />} />
              <Route path="/sign-up" element={<SignUp web3={web3}
                contract={contract}
                account={account}
                accountCreated={accountCreated} />} />
                <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>

          </div>
        </Router>
      </div>
    );

  }

}

export default App;
