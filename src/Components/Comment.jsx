import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from "../Firebase/Firebase";
import { useAuth } from "../Context/AuthContext";

const Comment = ({ authorId, blogId }) => {
    const {currentUser} = useAuth()

    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchComments()
    }, [])

    const fetchComments = async () => {
        const commentsRef = collection(db, "blogs", authorId, "userblogs", blogId, "comments");
        try {
            const snapshot = await getDocs(commentsRef);
            const commentsList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsList);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false)
        }
    };


    const addComment = async () => {
        if (!newComment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        const commentsRef = collection(db, "blogs", authorId, "userblogs", blogId, "comments");

        const comment = {
            text: newComment,
            commenterName: currentUser ? currentUser.displayName || "Anonymous" : "Guest",
            createdAt: new Date().toISOString(),
        };

        try {
            setLoading(true);
            await addDoc(commentsRef, comment);
            setNewComment("");
            fetchComments(); // Refresh comments after adding
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
    return (
        <>
        <hr className="mt-4"/>
            <div className="mt-4">
                <h3 className="font-medium mb-2 text-xl">Comments:</h3>
                {/* Comments List */}
                <ul className="space-y-2">
                    {comments.map((comment) => (
                        <li key={comment.id} className="border-b py-2">
                            <p className="text-sm">{comment.text}</p>
                            <p className="text-xs text-gray-500">
                                {comment.commenterName} |{" "}
                                {new Date(comment.createdAt).toLocaleDateString("en-GB")} | {" "}
                                                    {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true
                                                    })}
                                {/* {comment.createdAt?.toDate().toLocaleString()} */}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Add Comment Section */}
                <div className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows="2"
                        className="border rounded w-full p-2 text-sm"
                    ></textarea>
                    <button
                        onClick={addComment}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm mt-2"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Comment"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default Comment