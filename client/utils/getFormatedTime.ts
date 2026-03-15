export const getFormatedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
        hrs > 0 ? hrs : null,
        mins.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0'),
    ]
        .filter((v) => v !== null)
        .join(':');
};