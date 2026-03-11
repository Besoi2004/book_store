const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    return url.replace(/\/$/, '') // strip trailing slash
}

export default getBaseURL