import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserDisplay() {

    const [base64Image, setBase64Image] = useState('');
    const [user, setUser] = useState('');

    const bufferToBase64 = (bufferFrom) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(bufferFrom));

        bytes.forEach((b) => binary += String.fromCharCode(b));

        return window.btoa(binary);
    };

    useEffect(() => {
        axios.get('http://localhost:3000/get-user')
            .then((response) => {
                let userName = response.data.users[5].name + " " + response.data.users[5].surname
                setUser(userName);
            })
            .catch(() => {

            });
    }, []);

    return (
        <div>
            <div
                style={{
                    color: 'white',
                    fontSize: 18,
                    textAlign: 'center',

                }}
            >
                {user}
            </div>
        </div >
    );

}

export default UserDisplay;
