export function errorLog(message?: any, ...options: any[]) {
    if (process.env.NODE_ENV === "production") {
        // TODO: log error in production mode.
    } else {
        console.error(message, ...options)
    }
}