import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../Firebase/Firebase";
import { useBlog } from "../Context/BlogContext";
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const EditBlog = () => {
    const { updateBlogPostToFirebase } = useBlog()
    const { blogId, userId } = useParams(); // IDs from URL params
    const [blogData, setBlogData] = useState({ title: "", description: "" });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            const blogRef = doc(db, "blogs", userId, "userblogs", blogId);
            const snapshot = await getDoc(blogRef);
            if (snapshot.exists()) {
                setBlogData(snapshot.data());
            } else {
                console.error("Blog not found");
            }
            setIsLoading(false);
        };
        fetchBlog();
    }, [blogId, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    const handleDescriptionChange = (value) => {
        setBlogData({ ...blogData, description: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(blogData)
        try {
            updateBlogPostToFirebase(userId, blogId, blogData)
            console.log("Blog updated successfully");
            navigate("/");
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Blog Title
                    </label>
                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={blogData.title}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Blog Description
                    </label>
                    <ReactQuill
                        value={blogData.description}
                        onChange={handleDescriptionChange}
                        theme="snow"
                    />
                    
                </div>



                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                        Update
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center mt-4">
                        <ClipLoader color={"#4A90E2"} loading={isLoading} />
                    </div>
                )}
            </form>

        </>










    );
};

export default EditBlog;
