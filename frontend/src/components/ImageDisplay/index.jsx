import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ImageDisplay() {

    const [base64Image, setBase64Image] = useState('');

    const bufferToBase64 = (bufferFrom) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(bufferFrom));

        bytes.forEach((b) => binary += String.fromCharCode(b));

        return window.btoa(binary);
    };


    useEffect(() => {

        const image = axios.get('http://localhost:3000/get-image', {
            responseType: 'arraybuffer',
        },);

        image.then((response) => {
            const base64 = bufferToBase64(response.data);
            setBase64Image('data:image/jpg;base64,' + base64);
        });

    }, []);

    return (
        <div>
            <h2>Image</h2>
            {base64Image && <img src={base64Image} alt="user" />}
        </div>
    );

}

export default ImageDisplay;
