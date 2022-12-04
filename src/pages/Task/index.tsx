import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Create from '../../components/CreateModal';
import { Detail } from '../../components/Detail';
import { EditProjectName } from '../../components/EditProjectName';
import {
    onDrop,
    onDropBoard,
    onEnd,
    onLeave,
    onOver,
} from '../../services/dragndrop';
import { removeProject } from '../../services/project';
import { Board, Item, Project } from '../../types/project';
import './styles.css'

export const Task: FC<{ setProjects: Function; projects: Project[] }> = ({
    setProjects,
    projects,
}) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [boards, setBoards] = useState<Board[]>();
    const [projectName, setProjectName] = useState<string>('');
    const [modal, setModal] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentDetail, setCurrentDetail] = useState<Item>();
    const [projectModal, setProjectModal] = useState<boolean>(false);
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);

    useEffect(() => {
        const projects: Project[] = JSON.parse(localStorage.getItem('projects')!);
        projects.forEach((project) => {
            if (project.id === +projectId!) {
                setBoards(project.data);
                setProjectName(project.name);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projects]);

    const handleMore = (item: Item) => {
        setCurrentDetail(item);
        setModal('detail');
    };

    const handleStart = (e: any, board: Board, item: Item) => {
        e.stopPropagation();
        setCurrentBoard(board);
        setCurrentItem(item);
    };

    const handleDrop = (e: any, board: Board, item: Item) => {
        e.stopPropagation();
        e.preventDefault();
        setBoards(onDrop(board, item, currentBoard!, currentItem!, boards!));
    };

    const handleDropBoard = (e: any, board: Board) => {
        e.preventDefault();
        setBoards(onDropBoard(board!, currentItem!, currentBoard!, boards!));
    };

    const handleShowModal = () => {
        setShowModal(!showModal)
    }

    const saveEffect = () => {
        let projects: Project[] = JSON.parse(localStorage.getItem('projects')!);

        if (boards) {
            projects = projects.map((project) => {
                if (project.id === +projectId!) {
                    project.data = boards!;
                }
                return project;
            });
        }
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    useEffect(saveEffect, [boards, projectId]);

    const handleDelete = () => {
        // eslint-disable-next-line no-restricted-globals
        const conf = confirm('Are you sure to delete this project?');
        if (!conf) return;
        setProjects(removeProject(+projectId!));
        navigate('/');
    };

    return (
        <div className='desks'>
            {projectModal && showModal && (
                <EditProjectName
                    setModal={setProjectModal}
                    setProjects={setProjects}
                    id={+projectId!}
                />
            )}
            {modal === 'detail' && showModal ? (
                <Detail
                    setModal={setModal}
                    data={currentDetail}
                    projectId={+projectId!}
                />
            ) : modal === 'create' ? (
                <Create
                    type='Create'
                    setProjects={setProjects}
                    setModal={setModal}
                    projectId={+projectId!}
                    item={undefined}
                />
            ) : modal === 'edit' ? (
                <Create
                    type='Edit'
                    setProjects={setProjects}
                    setModal={setModal}
                    projectId={+projectId!}
                    item={currentDetail}
                />
            ) : null}
            <div className='desks__header'>
                <div className='desks__header-start'>
                    <h1>{projectName}</h1>
                    <div className='desks__header-btn'>
                        <button
                            onClick={() => {
                                setProjectModal(true);
                                handleShowModal()
                            }}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
            <div className='desks-content'>
                {boards &&
                    boards.map((board) => {
                        return (
                            <div
                                onDrop={(e) => handleDropBoard(e, board)}
                                onDragOver={onOver}
                                key={board.id}
                                className='board'>
                                <h2 className='board__title'>
                                    {board.title}
                                    {board.id === 1 ? (
                                        <button onClick={() => { setModal('create'); handleShowModal() }}>
                                            Add task
                                        </button>
                                    ) : null}
                                </h2>
                                <ul className='item-wapper'>
                                    {board.items.map((item) => {
                                        const isDead = Date.parse(item.deadline) - Date.now() < 0;
                                        return (
                                            <div
                                                key={item.id}
                                                draggable
                                                onDragOver={onOver}
                                                onDragLeave={onLeave}
                                                onDragStart={(e) => handleStart(e, board, item)}
                                                onDragEnd={onEnd}
                                                onDrop={(e) => handleDrop(e, board, item)}
                                                className='board__item'
                                                style={{
                                                    borderColor:
                                                        isDead && board.id !== 3 ? 'red' : '#30363d',
                                                }}
                                            >
                                                <div className='item__head'>
                                                    <div className='indicator'
                                                        style={{
                                                            background:
                                                                item.prior === 'average'
                                                                    ? 'yellow'
                                                                    : item.prior === 'high'
                                                                        ? 'red'
                                                                        : 'green',
                                                        }}
                                                    />
                                                    <h3 className='item__title'>{item.title}</h3>
                                                    <p className='item__title-taskcount'>{item.tasks.length}</p>
                                                    <p className='item__deadline'>{item.deadline}</p>
                                                </div>
                                                <div className='item__body'>
                                                    <div>
                                                        <p>Files: {item.files?.length}</p>
                                                        <p>Created: {item.created.toString()}</p>
                                                    </div>
                                                    <button onClick={() => handleMore(item)}>
                                                        More
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
            </div >
        </div>
    );
};

