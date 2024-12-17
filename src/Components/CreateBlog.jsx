import {  useState } from "react"
import { useBlog } from "../Context/BlogContext"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { ClipLoader } from "react-spinners"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const CreateBlog = () => {
    const { createNewBlogToFirebase } = useBlog()
    const { currentUser } = useAuth()
    const [blogData, setBlogData] = useState({title: '', description: '',  type: ''})
    const [isLoading, setIsLoading] = useState(false)
    

    const handleChange = (event) => {
        const {name, value} = event.target
        setBlogData({...blogData, [name]: value})
    }

    const handleDescriptionChange = (value) => {
        setBlogData({...blogData, description: value})
    }

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!currentUser) {
            alert("You need to be logged in to create a blog.")
            return
        }
        const newBlog = {
            ...blogData,
            author: currentUser.displayName || currentUser.email,
            authorId: currentUser.uid,
            date: new Date().toISOString()
        }
        setIsLoading(true)
        try {
            const result = await createNewBlogToFirebase(newBlog)
            if(result === true) {
                setBlogData({title: '', description: '', type: ''})
                navigate('/')
                console.log("Submitted")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
        
        
    }

    return (
        <>
            {currentUser ? <>
                <div>
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
                        {/* <input
                            name="description"
                            type="text"
                            placeholder="Description"
                            value={blogData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        /> */}
                        <div>
                            <ReactQuill 
                                
                                value={blogData.description}
                                onChange={handleDescriptionChange}
                                theme="snow"
                            />
                        </div>
                        {/* <p className="preview" dangerouslySetInnerHTML={{ __html: blogData.description }} /> */}
                    </div>

                    

                    <div className="flex items-center justify-between">
                        <button 
                            onClick={handleSubmit}
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                            Create
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center mt-4">
                            <ClipLoader color={"#4A90E2"} loading={isLoading} />
                        </div>
                    )}
                </form>
            </div>
            </> : "Login First"}
        </>
    )
}

export default CreateBlog