// backend/services/textbeltService.js

import axios from 'axios';

const sendSms = async (to, message) => {
    try {
        const response = await axios.post('https://textbelt.com/text', {
            phone: to,
            message: message,
            key: 'textbelt' // You can use 'textbelt' for free messages
        });

        if (response.data.success) {
            console.log('SMS sent successfully:', response.data);
        } else {
            console.log('Error sending SMS:', response.data);
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

export default sendSms;
