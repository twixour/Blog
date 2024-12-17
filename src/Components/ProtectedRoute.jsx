import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const ProtectedRoute = ({children}) => {
    const {currentUser, loading} = useAuth()
    if(loading) {
        return <ClipLoader size={50} color={"#123abc"} loading={loading} />
    }
    if(!currentUser) {
        return <Navigate to="/login" />
    }
    return children
}

export default ProtectedRoute