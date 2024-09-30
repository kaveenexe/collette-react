import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {

    const { user } = useContext(AuthContext);
    // console.log(user);
    
    return(
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin! You have full access to manage the platform.</p>
            {/* Additional admin-specific content here */}
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>User Roll: {user.role}</p>
            <p>User ID: {user.userId}</p>
            <p>User Email: {user.email}</p>
            <p>User NIC: {user.nic}</p>
            <p>User Address: {user.address}</p>

        </div>
    )
}
export default AdminDashboard;