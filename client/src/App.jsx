import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Navbar from './components/Navbar';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // user is null if not logged in
    });
    return () => unsubscribe(); // clean up listener
  }, []);

  return (
    <Router>
      <ScrollToTop />
      {user && <Navbar />} {/* 👈 Only show Navbar if logged in */}
      <AnimatedRoutes />
    </Router>
  );
}
