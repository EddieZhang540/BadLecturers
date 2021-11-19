import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserProvider';

function Home() {
    const user = useContext(UserContext);
    return (
        <div>
            {user === null ? "Not logged in" : user.displayName}
        </div>
    );
}

export default Home;