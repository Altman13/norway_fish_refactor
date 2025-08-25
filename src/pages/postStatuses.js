export default async function postStatusesMsg(allStatusesSendingMessages) {
    try {
        const response = await fetch('http://192.168.3.1:8000/api/dep/allstatuses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allStatusesSendingMessages),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        console.log('🚀 postStatusesMsg response:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при отправке статусов:', error);
        throw error;
    }
}