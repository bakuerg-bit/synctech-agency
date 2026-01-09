// Email notification helper
export const sendEmailNotification = async (type: 'lead' | 'blog', data: any) => {
    try {
        // Using Formspree for email notifications
        const response = await fetch('https://formspree.io/f/xkoweedl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: type === 'lead' ? '🔔 New Lead Received' : '📝 New Blog Post Published',
                type,
                ...data,
                timestamp: new Date().toISOString()
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Email notification failed:', error);
        return false;
    }
};
