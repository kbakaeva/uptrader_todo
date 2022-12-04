import { FC, useState } from "react";
import { editProject } from "../../services/project";
import './styles.css';

export const EditProjectName: FC<{
    setModal: Function;
    setProjects: Function;
    id: number;
}> = ({ setModal, setProjects, id }) => {
    const [newName, setNewName] = useState('');

    const handleEdit = (e: any) => {
        e.preventDefault();
        if (!newName) return;
        setProjects(editProject(newName, id));
        setModal('');
        setNewName('');
    };

    return (
        <form
            onSubmit={(e) => handleEdit(e)}
            onClick={() => setModal(false)}
            className='editProject'>
            <div
                onClick={(e) => e.stopPropagation()}>
                <input
                    value={newName}
                    type='text'
                    autoFocus
                    onChange={(e) => setNewName(e.target.value)} />
                <button>Edit</button>
            </div>
        </form>
    );
};