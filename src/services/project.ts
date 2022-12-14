import { Project } from "../types/project";
import { initialBoard } from "./dragndrop";

export class ProjectService {
    createProject(name: string) {
        const projects = JSON.parse(localStorage.getItem('projects')!);
        const newProject: Project = {
            id: projects.length ? projects![projects!.length - 1].id + 1 : 1,
            name: name,
            data: initialBoard,
        };
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        return projects;
    }

    editProject(name: string, id: number) {
        let projects: Project[] = JSON.parse(localStorage.getItem('projects')!);
        projects = projects.map((project) => {
            if (project.id === id) {
                project.name = name;
            }
            return project;
        });
        localStorage.setItem('projects', JSON.stringify(projects));
        return projects;
    }

    removeProject(id: number) {
        let projects: Project[] = JSON.parse(localStorage.getItem('projects')!);
        projects = projects.filter((project) => project.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        return projects;
    }
}

export const { createProject, editProject, removeProject } =
    new ProjectService();
