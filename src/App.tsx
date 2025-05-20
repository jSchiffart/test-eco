import React from 'react';
import { Container } from '@mui/material';
import { Hero } from './components/Hero/Hero';
import { Simulator } from './components/Simulator/Simulator';
import { WhyBiologicalFarming } from './components/WhyBiologicalFarming/WhyBiologicalFarming';
import { Footer } from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Hero />
          <Simulator />
          <WhyBiologicalFarming />
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default App;
