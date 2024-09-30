import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const VendorDashboard = () => {

    const { user } = useContext(AuthContext);

    return(
        <div>
            <h2>Vendor Dashboard</h2>
            <p>Welcome, Vendor! You have full access to manage the platform.</p>
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
export default VendorDashboard;