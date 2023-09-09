import React, { createContext, useContext, useState } from 'react';

// Create a UserContext
const UserContext = createContext();

// Create a custom hook for using the UserContext
export const useUser = () => {
    return useContext(UserContext);
};

// Create a UserProvider component
export const UserProvider = ({ children }) => {
    // You can initialize user data here
    const [user, setUser] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        image: null, // You can initialize this with an image URL or other data
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
