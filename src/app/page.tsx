'use client';

import { useState } from 'react';
import AppHeader from "./components/app-header";
import ProjectManager from './components/ProjectsManager';
// Corrected component name and import path

export default function Home() {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const toggleNewProjectForm = () => {
    setShowNewProjectForm(prev => !prev); 
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <AppHeader onNewProjectClick={toggleNewProjectForm} />
      <main className="flex-grow"> 
        <h1 className="text-4xl font-bold text-center my-8">Welcome to Your Project Dashboard</h1>
       
        <ProjectManager initialShowForm={showNewProjectForm} />
      </main>
    </div>
  );
}
