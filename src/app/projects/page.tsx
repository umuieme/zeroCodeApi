'use client'
import { de } from "date-fns/locale";
import ProjectManager from "../components/ProjectsManager";
import AppHeader from "../components/app-header";
import { useState } from "react";


export default function ProjectListPage() {
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