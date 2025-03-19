const REMOTE_BASE_URL: string = import.meta.env.VITE_BASE_URL;
const REMOTE_SMALL_IMAGES_URL: string = import.meta.env.VITE_SMALL_IMAGES_URL;
const REMOTE_MEDIUM_IMAGES_URL: string = import.meta.env.VITE_MEDIUM_IMAGES_URL;
const REMOTE_LARGE_IMAGES_URL: string = import.meta.env.VITE_LARGE_IMAGES_URL;
const CLIENT_ID: string = import.meta.env.VITE_APP_CLIENT_ID;

const APP_ENV = {
    REMOTE_BASE_URL,
    REMOTE_SMALL_IMAGES_URL,
    REMOTE_MEDIUM_IMAGES_URL,
    REMOTE_LARGE_IMAGES_URL,
    CLIENT_ID
}
export { APP_ENV };