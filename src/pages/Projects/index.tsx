import React, { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { createProject } from '../../services/project';
import { Project } from '../../types/project';
import './styles.css';

export const Projects: FC<{ setProjects: Function; projects: Project[] }> = ({
    setProjects,
    projects,
}) => {
    const [name, setName] = useState<string>('');
    const [search, setSearch] = useState<string>('');

    const handleCreate = (e: any) => {
        e.preventDefault();
        if (!name) return;
        setProjects(createProject(name));
        setName('');
    };

    const handleSearch = (e: any) => {
        e.preventDefault();
        projects = projects.filter((project) => project.name === search);
        setProjects(projects)
    }

    return (
        <div className='projects'>
            <div className='projects__form'>
                <form>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type='text'
                    />
                    <button onClick={(e) => handleCreate(e)}>Create</button>
                </form>
                <form>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type='text' />
                    <button onClick={(e) => handleSearch(e)}>Search</button>
                </form>
            </div>
            <h1 className='projects__title'>PROJECTS:</h1>
            <ul className='container'>
                {projects.length === 0 ? 'No projects ...' :
                    projects.map((project) => {
                        return (
                            <div className='projects__item' key={project.id}>
                                <h2>{project.name}</h2>
                                <div className='projects__info'>
                                    <div className='projects__stats'>
                                        {project.data &&
                                            project.data.map((status) => {
                                                return (
                                                    <h5 key={status.id}>
                                                        {status.title}
                                                        <span>{status.items.length}</span>
                                                    </h5>
                                                );
                                            })}
                                    </div>
                                    <NavLink
                                        to={`/project/${project.id}`}
                                        className='projects__item-go'>
                                        GO TO"{project.name}"
                                    </NavLink>
                                </div>
                            </div>
                        );
                    })}
            </ul>
        </div>
    );
};
