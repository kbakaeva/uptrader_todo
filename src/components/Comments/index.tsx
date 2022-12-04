import React, { FC, useState } from 'react';
import { v4 } from "uuid";
import { Comment } from '../../types/project';
import { commentChild } from '../../services/todo';
import './styles.css';

export const Comments: FC<{
    comments: Comment[];
    setComments: Function;
    itemId: number;
}> = ({ comments, setComments, itemId }) => {
    const [show, setShow] = useState<boolean>(false);
    const [inputShow, setInputShow] = useState<string>('');
    const [commentValue, setCommentValue] = useState<string>('');

    const submit = (e: any, commentId: string) => {
        e.preventDefault();
        if (!commentValue) return;
        const newComment: Comment = {
            id: v4(),
            text: commentValue,
            comments: [],
        };
        setComments(commentChild(commentId, itemId, newComment));
        setCommentValue('');
        setInputShow('');
    };

    return (
        <div className='comments'>
            <p>
                <span onClick={() => setShow((s) => !s)}>
                    {comments.length ? (
                        <span>{show ? '-' : '+'}</span>
                    ) : null}
                </span>
                <span>{comments.length ? comments.length : null}</span>
            </p>
            {show &&
                comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <p>{comment.text}</p>
                        {inputShow === comment.id ? (
                            <form onSubmit={(e) => submit(e, comment.id)}>
                                <input
                                    autoFocus
                                    type='text'
                                    value={commentValue}
                                    onChange={(e) => setCommentValue(e.target.value)}
                                    placeholder='Comment'
                                />
                                <button>Comment</button>
                                <button onClick={() => setInputShow('')}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setInputShow(comment.id)}>
                                Comment
                            </button>
                        )}
                        {comment.comments.length ? (
                            <Comments
                                comments={comment.comments}
                                setComments={setComments}
                                itemId={itemId}
                            />
                        ) : null}
                    </React.Fragment>
                ))}
        </div>
    );
};
