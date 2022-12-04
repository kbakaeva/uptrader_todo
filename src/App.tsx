import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Projects } from './pages/Projects';
import { Task } from './pages/Task';
import { incrementDevtime } from './services/todo';
import { Project } from './types/project';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let storage = JSON.parse(localStorage.getItem('projects')!);
    if (!storage) {
      localStorage.setItem('projects', JSON.stringify([]));
      storage = JSON.parse(localStorage.getItem('projects')!);
    }
    if (!projects.length && storage.length) setProjects(storage);
  }, [projects]);

  useEffect(() => {
    const intervalId = setInterval(() => incrementDevtime(), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={<Projects {...{ projects, setProjects }} />}
        />
        <Route
          path='/project/:projectId'
          element={<Task {...{ projects, setProjects }} />}
        />
      </Routes>
    </div>
  );
};

export default App;
