const getBaseURL = () => {
    // Use environment variable in production, fallback to localhost in development
    return import.meta.env.VITE_API_URL || 'http://localhost:5000'
}

export default getBaseURL