export type APIResponse<T> = {
    ok: true, data: T
} | {
    ok: false, message: string
}