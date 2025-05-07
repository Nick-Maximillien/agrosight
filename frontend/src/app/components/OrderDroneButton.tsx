'use client'

export default function OrderDroneButton({ token }: { token: string }) {
    const handleClick = async () => {
        try {
            await fetch('http://localhost:8000/deploy-drone/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Drone deployed!');
        } catch (err) {
            console.error('Deployment failed:', err);
        }
    };

    return <button onClick={handleClick}>Start Drone Scan</button>;
}