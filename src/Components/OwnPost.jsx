import { useBlog } from "../Context/BlogContext"
import { ClipLoader } from "react-spinners"
import { useState, useEffect } from "react"
import { useAuth } from "../Context/AuthContext"
import { useNavigate } from "react-router-dom"
import { db } from '../Firebase/Firebase'
import {collection, query, where, getDocs} from "firebase/firestore"

const OwnPost = () => {
    const [ownPosts, setOwnPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const { currentUser } = useAuth()
    const { blogList, deleteBlogFromFirebase } = useBlog()
    const [expandedBlogs, setExpandedBlogs] = useState({})
    const navigate = useNavigate()


    useEffect(() => {
        const fetchOwnPosts = async () => {
            if (!currentUser) return; // Return early if user is not logged in

            try {
                // Reference to user-specific posts
                const userPostsQuery = query(
                    collection(db, "blogs", currentUser.uid, "userblogs")
                );

                const querySnapshot = await getDocs(userPostsQuery);

                // Map through the documents to get post data
                const userPosts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setOwnPosts(userPosts); // Set state with filtered posts
            } catch (error) {
                console.error("Error fetching user posts:", error);
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        fetchOwnPosts();
    }, [currentUser]);

    const toggleDescription = (id) => {
        setExpandedBlogs((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }


    if (isLoading) {
        return <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
    }
    if (!blogList || blogList.length === 0) return "No blog Post"
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Latest Blogs</h1>
                <div className="space-y-8">
                    {ownPosts.map((blog) => {
                        const isExpanded = expandedBlogs[blog.id] || false; // Default to false if undefined
                        const shortDescription = blog.description
                            .split(" ")
                            .slice(0, 7)
                            .join(" "); // Show only the first 7 words

                        return (
                            <div
                                key={blog.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Blog Content */}
                                <div className="p-6 flex flex-col sm:flex-row">
                                    {/* Blog Image */}
                                    {blog.image && (
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full sm:w-1/3 h-auto object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                                            {blog.title}
                                        </h2>
                                        <div className="text-gray-600 text-sm mt-4">
                                            {isExpanded
                                                ?
                                                (<div dangerouslySetInnerHTML={{ __html: blog.description }} />)
                                                // Show full description if expanded
                                                : (<div dangerouslySetInnerHTML={{ __html: `${shortDescription}` }} />)
                                            } {/* Show truncated description */}
                                        </div>
                                        <button
                                            className="text-blue-600 text-sm mt-2 hover:underline"
                                            onClick={() => toggleDescription(blog.id)}
                                        >
                                            {isExpanded ? "Read Less" : "Read More"}
                                        </button>
                                        <div className="flex items-center mt-4">
                                            <div>
                                                <p className="text-gray-800 text-sm font-medium">
                                                    {blog.author}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    {new Date(blog.date).toLocaleDateString("en-GB")} | {" "}
                                                    {new Date(blog.date).toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true
                                                    })}
                                                </p>

                                                {currentUser && currentUser.uid === blog.authorId && (
                                                    <div className="mt-4">
                                                        <button
                                                            onClick={() => deleteBlogFromFirebase(blog.id, blog.authorId)}
                                                            className="text-red-500 hover:text-red-700 mr-4"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/edit/${blog.authorId}/${blog.id}`)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default OwnPost