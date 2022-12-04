import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    commentParent,
    completeTogle,
    deleteTodo,
} from '../../services/todo';
import { Comment, Item } from '../../types/project';
import { format } from 'date-fns';
import { v4 } from "uuid";
import { Comments } from '../Comments';
import './styles.css'

export const Detail: FC<{
    setModal: Function;
    data: Item | undefined;
    projectId: number;
}> = ({ setModal, data, projectId }) => {
    const {
        id,
        title,
        prior,
        tasks: propTasks,
        files,
        created,
        deadline: propDead,
        devTime,
        comments: propComments,
    } = data!;

    const navigate = useNavigate();
    const [tasks, setTasks] = useState(propTasks);
    const [comments, setComments] = useState(propComments);
    const [commentInput, setCommentInput] = useState<boolean>(false);
    const [commentValue, setCommentValue] = useState<string>('');
    const deadline = propDead.split('-');
    const d1 = +deadline[2];
    const d2 = +deadline[1] - 1;
    const d3 = +deadline[0];

    const handleDelete = (e: any) => {
        e.preventDefault();
        // eslint-disable-next-line no-restricted-globals
        const conf = confirm('Are you sure to delete the task?');
        if (!conf) return;
        deleteTodo(projectId, id);
        navigate('/');
    };

    const handleComplete = (taskId: number) => {
        const res = completeTogle(projectId, id, taskId);
        setTasks(res);
    };

    const handleComment = (e: any) => {
        e.preventDefault();
        const newComment: Comment = {
            id: v4(),
            text: commentValue,
            comments: [],
        };
        setComments(commentParent(projectId, id, newComment));
        setCommentInput(false);
        setCommentValue('');
    };

    return (
        <div onClick={() => setModal(false)} className='taskdetail'>
            <div onClick={(e) => e.stopPropagation()}>
                <div className='taskdetail__head'>
                    <h3>{title}
                        <span
                            style={{
                                background:
                                    prior === 'average'
                                        ? 'yellow'
                                        : prior === 'high'
                                            ? 'red'
                                            : 'green',
                            }}
                            className='indicator'
                        ></span>
                    </h3>
                    <div className='taskdetail__btns'>
                        <button
                            onClick={() => setModal('edit')}>
                            Edit
                        </button>
                        <button onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
                <div className='taskdetail__desc'>
                    {commentInput ? (
                        <form onSubmit={(e) => handleComment(e)}>
                            <input
                                autoFocus
                                type='text'
                                value={commentValue}
                                onChange={(e) => setCommentValue(e.target.value)}
                                placeholder='Comment'
                            />
                            <button>Comment</button>
                            <button
                                onClick={() => setCommentInput(false)}>
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setCommentInput(true)}>
                            Comment
                        </button>
                    )}
                    <Comments comments={comments} setComments={setComments} itemId={id} />
                </div>
                <ul className='taskdetail__desc'>
                    Tasks:
                    {tasks.length
                        ? tasks.map((task) => {
                            return (
                                <div key={task.id}>
                                    <label>
                                        <input
                                            onChange={() => handleComplete(task.id)}
                                            type='checkbox'
                                            checked={task.completed}
                                        />
                                        {task.title}
                                    </label>
                                </div>
                            );
                        })
                        : ' No task'}
                </ul>
                <ul className='taskdetail__desc'>
                    Files:
                    {files?.length
                        ? files!.map((file) => (
                            <div key={file.name} className='taskdetail__file'>
                                <a href={file.url} target='_blank' rel='noreferrer'>
                                    {file.name}
                                </a>
                                <a className='download' href={file.url} download>
                                    download
                                </a>
                            </div>
                        ))
                        : ' No file'}
                </ul>
                <div className='taskdetail__foot'>
                    <p>Created: {created + ''}</p>
                    <p>Development time:{' '}
                        {`${Math.floor(devTime / 60 / 60)} : ${Math.floor(
                            (devTime / 60) % 60,
                        )} : ${devTime % 60}s`}</p>
                    <p>Deadline: {format(new Date(d1, d2, d3), 'PP')}</p>
                </div>
            </div>
        </div>
    );
};
