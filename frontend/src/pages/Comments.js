import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getComments } from "../services/commentService";

function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  const loadComments = useCallback(async () => {
    try {
      const res = await getComments(id);
      setComments(res.data);
    } catch (error) {
      console.log("Error loading comments:", error);
    }
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <div className="container mt-4">
      <h3>Ticket Replies</h3>

      {comments.length === 0 ? (
        <p>No replies yet</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className="card p-3 mb-2 shadow-sm">
            <p className="mb-1">{c.message}</p>
            <small className="text-muted">
              {c.userId} • {new Date(c.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Comments;