import React from 'react';
import { Container } from '@mantine/core'; 
import YearlyCropTable from './components/YearlyCropTable'; 
import AverageCropTable from './components/AverageCropTable';
import './index.css'; 

// Define the main App component
const App: React.FC = () => {
  return (
    <Container> {/* Container component from Mantine for layout */}
      <h1>Yearly Crop Production</h1> {/* Heading for yearly crop production table */}
      <YearlyCropTable /> {/* Render YearlyCropTable component */}
      <h1>Average Crop Data (1950-2020)</h1> {/* Heading for average crop data table */}
      <AverageCropTable /> {/* Render AverageCropTable component */}
    </Container>
  );
};

export default App; 