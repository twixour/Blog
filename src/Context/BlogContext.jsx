import { addDoc, collection, collectionGroup, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../Firebase/Firebase'
import { useAuth } from './AuthContext'
export const BlogContext = createContext()
export const useBlog = () => useContext(BlogContext)

export const BlogProvider = ({ children }) => {
    const { currentUser } = useAuth()
    const [blogList, setBlogList] = useState([])

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        // Listen to real-time updates from all 'userblogs' subcollections
        const unsubscribe = onSnapshot(
            collectionGroup(db, "userblogs"), // Target all 'userblogs' subcollections
            (snapshot) => {
                console.log("Snapshot received:", snapshot.docs);

                // Map the snapshot to retrieve blog data
                const blogs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setBlogList(blogs);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching blogs", error);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    

    const createNewBlogToFirebase = async (blog) => {
        try {
            const userBlogRef = collection(db, "blogs", currentUser.uid, "userblogs")
            //await setDoc(doc(userBlogRef ), blog)
            await addDoc(userBlogRef, blog)
            return true
        } catch (error) {
            console.error(error)
        }

    }

    const updateBlogPostToFirebase = async (userId, blogId, blogData) => {
        console.log("from updateBlogPostToFirebase", userId, blogId, blogData)
        const blogRef = doc(db, "blogs", userId, "userblogs", blogId);
        await updateDoc(blogRef, blogData);
    }

    const deleteBlogFromFirebase = async (blogId, authorId) => {
        try {
            const blogRef = doc(db, "blogs", authorId, "userblogs", blogId)
            await deleteDoc(blogRef)
        } catch (error) {
            console.error(error)
        }
    }

    const value = {
        blogList,
        createNewBlogToFirebase,
        loading,
        deleteBlogFromFirebase,
        updateBlogPostToFirebase
    }
    return <BlogContext.Provider value={value}>
        {children}
    </BlogContext.Provider>
}