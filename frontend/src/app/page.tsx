"use server"
import { Suspense } from 'react';
import Link from 'next/link';
import LoginToggle from './components/LoginToggle';
import SignUpToggle from './components/SignupToggle';



const Home = () => {
  return (
    <div className="homeContainer">
      <div>
      </div>
        <Suspense fallback={<p>Loading...</p>}>
        <LoginToggle />
        </Suspense>
        <Suspense fallback={<p>Loading...</p>}>
        <SignUpToggle />
        </Suspense>
      </div>
  );
};

export default Home;