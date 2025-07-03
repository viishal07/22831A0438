import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import NotesForm from './components/NotesForm';
import StatsPage from './components/StatsPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Notes App
          </Typography>
          <Button color="inherit" component={Link} to="/">New Notes</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4, minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<NotesForm />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Container>
      <Box component="footer" sx={{ bgcolor: '#f5f5f5', py: 2, textAlign: 'center', fontSize: 14 }}>
        &copy; 2025 AffordMed. All rights reserved. For demo/interview purposes only.
      </Box>
    </Router>
  );
}

export default App;
