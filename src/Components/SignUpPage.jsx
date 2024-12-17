import { useNavigate } from "react-router-dom"
import { signUpFunction } from "../Firebase/Firebase"
import { useState } from "react"
import { ClipLoader } from "react-spinners"

const SignUpPage = () => {
    const [signUpObj, setSignUpObj] = useState({username: '', password1: '', password2: '', fullname: ''})
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (event) => {
        const {name, value} = event.target
        setSignUpObj({...signUpObj, [name]: value})
    }

    const handleSubmit = async (event) => {
        if(signUpObj.username !== "" && signUpObj.password1 !== "" && signUpObj.password2 !== "") {
            if(signUpObj.password1 === signUpObj.password2) {
                setIsLoading(true)
                try {
                    const result = await signUpFunction(signUpObj.username, signUpObj.password1, signUpObj.fullname)
                    if(result === true) {
                        setSignUpObj({username: '', password1: '', password2:''})
                        navigate('/')
                    }
                }
                catch (error) {
                    console.error("Login failed", error)
                } finally {
                    setIsLoading(false)
                }
                
            } else {
                alert("Password do not match")
            }
             
        } else {
            alert("Empty Fields")
        }
    }

    return (
        <>
            <div className="ml-3 mt-3 px-8 pt-6 pb-8 mb-4 shadow-md">
            <div className="text-center font-bold text-2xl text-blue-700">Sign Up</div>
                <form className="">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            UserName
                        </label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={signUpObj.username}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password1"
                            type="password"
                            placeholder="Password"
                            value={signUpObj.password1}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Repeat Password
                        </label>
                        <input
                            name="password2"
                            type="password"
                            placeholder="Repeat Password"
                            value={signUpObj.password2}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Full Name
                        </label>
                        <input
                            name="fullname"
                            type="text"
                            placeholder="Full Name"
                            value={signUpObj.fullname}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>

                    </div>

                    <div className="mt-3">
                        Already have an Account? 
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="ml-3 bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        >Login</button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center mt-4">
                            <ClipLoader color={"#4A90E2"} loading={isLoading} />
                        </div>
                    )}
                </form>
            </div>
        </>
    )
}

export default SignUpPage