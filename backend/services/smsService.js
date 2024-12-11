import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
    apiKey: 'f8efd6f2',
    apiSecret: 'hqUUrD6OBu3AImTY'
});

const sendSms = async (to, message) => {
    try {
        const from = 'SkillWave';
        const response = await vonage.sms.send({ to, from, text: message });
        console.log('Message sent successfully:', response);
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Error sending SMS.');
    }
};

export default sendSms;
