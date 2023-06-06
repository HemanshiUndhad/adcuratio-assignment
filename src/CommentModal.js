import React, { useState, useEffect } from 'react';
import { List, Input, Button, Modal } from 'antd';
import { EditOutlined, MessageOutlined } from '@ant-design/icons';
import './styles.css'

const CommentModal = () => {
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentById, setEditCommentById] = useState(null);
  const [replyCommentById, setReplyCommentById] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleChange = e => {
    setNewComment(e.target.value);
  };

  const handleEdit = (commentId, newContent) => {
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, content: newContent };
        }
        return comment;
      });
      return updatedComments;
    });
    setEditCommentById(null);
  };

  const handleSubmit = () => {
    if (newComment.trim() !== '') {
      setComments(prevComments => [
        ...prevComments,
        { id: Date.now(), content: newComment, replies: [] }
      ]);
      setNewComment('');
    }
  };

  const handleReply = (commentId, newReply) => {
    setComments(prevComments => {
      const updatedComments = prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, { id: Date.now(), content: newReply }]
          };
        }
        return comment;
      });
      return updatedComments;
    });
    setReplyCommentById(null);
    setReplyContent('');
  };

  const handleCancel = () => {
    setEditCommentById(null);
    setReplyCommentById(null);
    setReplyContent('');
  };

  const handleReplyChange = e => {
    setReplyContent(e.target.value);
  };

  const handleEditClick = commentId => {
    setEditCommentById(commentId);
  };

  const handleReplyClick = commentId => {
    setReplyCommentById(commentId);
  };

  return (
    <div>
      <div className='modalWrap'>
        <Input.TextArea value={newComment} onChange={handleChange} rows={5} placeholder="Write a comment here..." className='commentModal'/>
        <Button onClick={handleSubmit} type="primary" className='commentButton'>Add Comment</Button>
      </div>

      {/* EDIT & REPLY  */}
      {comments.map(comment => (
        <div key={comment.id} style={{ marginLeft: '20px', marginTop: '20px' }}>
          <div className='commentEditReply'>
          <div>{comment.content}</div>
          <div>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(comment.id)}
            >
              Edit
            </Button>
            <Button
              type="link"
              icon={<MessageOutlined />}
              onClick={() => handleReplyClick(comment.id)}
            >
              Reply
            </Button>
          </div>
          </div>
          {comment.replies.map(reply => (
            <div key={reply.id} className='reply'>
              {reply.content}
            </div>
          ))}

          {editCommentById === comment.id && (
            <Modal
            title="Edit Comment"
            visible={editCommentById === comment.id}
            onCancel={handleCancel}
            onOk={() => handleEdit(comment.id, document.getElementById(`editInput-${comment.id}`).value)}
            okText="Save"
          >
            <Input.TextArea id={`editInput-${comment.id}`} defaultValue={comment.content} autoFocus />
          </Modal>
          
          )}


          {replyCommentById === comment.id && (
          <Modal
          title="Reply to Comment"
          visible={replyCommentById === comment.id}
          onCancel={handleCancel}
          onOk={() => handleReply(comment.id, document.getElementById(`replyInput-${comment.id}`).value)}
          okText="Reply"
        >
          <Input.TextArea id={`replyInput-${comment.id}`} value={replyContent} onChange={handleReplyChange} autoFocus />
        </Modal>
        
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentModal;
