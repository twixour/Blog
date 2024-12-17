import { useNavigate } from "react-router-dom"
import { loginFunction } from "../Firebase/Firebase"
import { useState } from "react"
import { ClipLoader } from "react-spinners"

const LoginPage = () => {
    const [loginObj, setLoginObj] = useState({username: '', password: ''})
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (event) => {
        const {name, value} = event.target
        setLoginObj({...loginObj, [name]: value})
    }

    const handleSubmit = async (event) => {
        if(loginObj.username !== "" && loginObj.password !== "") {
            setIsLoading(true)
            try {
                const result = await loginFunction(loginObj.username, loginObj.password)
                if(result) {
                    setLoginObj({username: '', password: ''})
                    navigate('/')
                }
            } catch (error) {
                console.error("Login failed", error)
            } finally {
                setIsLoading(false)
            }
        } else {
            alert("Empty Credential")
        }
    }

    return (
        <>
            <div className="mt-3 ml-3 px-8 pt-6 pb-8 mb-4 shadow-md">
                <div className="text-center font-bold text-2xl text-blue-700">Login</div>
                <form className="">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            UserName
                        </label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={loginObj.username}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={loginObj.password}
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
                            {isLoading ? "Logging In..." : "Login"}
                        </button>
                    </div>

                    <div className="mt-3">
                        Don't have an Account? 
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="ml-3 bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                        >Sign Up</button>
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

export default LoginPage