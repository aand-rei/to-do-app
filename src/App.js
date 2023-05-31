import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tasks from './components/ui/main/Tasks';
import Header from "./components/ui/main/Header";

function App() {
  return (
      <>
        <Header/>
        <Router>
            <Routes>
            <Route path="/to-do-app" element={<Tasks />} exact/>
            </Routes>
        </Router>
      </>
  );
}

export default App;
