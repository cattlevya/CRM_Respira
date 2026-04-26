import React, { useState } from 'react';
import DashboardUser from './DashboardUser';
import DashboardExpert from './DashboardExpert';
import { Users, Shield } from 'lucide-react';

const Dashboard = () => {
    // SIMULATION: Change this state to toggle views
    const [userRole, setUserRole] = useState('user'); // 'user' or 'expert'

    return (
        <div className="relative">
            {/* Role Switcher Removed as per directive */}

            {/* Render Dashboard based on Role */}
            {userRole === 'user' ? <DashboardUser /> : <DashboardExpert />}
        </div>
    );
};

export default Dashboard;
