import React from 'react';
import { BrowserRouter as Router, Routes , Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import LoginForm from './Pages/LoginForm'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import ProtectedWrapper from './Components/ProtectedWrapper'
import AccountManagement from './Pages/AccountManagement'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/profile' element={<AccountManagement />} />
          {/* <Route element={<ProtectedWrapper />}> */}
              <Route path='/dashboard' element={<Dashboard />} />
          {/* </Route> */}
        </Routes>
      </div>

    </Router>
  );
}

export default App;
