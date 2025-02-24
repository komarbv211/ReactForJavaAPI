const REMOTE_BASE_URL: string = import.meta.env.VITE_BASE_URL;
const REMOTE_SMALL_IMAGES_URL: string = import.meta.env.VITE_SMALL_IMAGES_URL;
const REMOTE_MEDIUM_IMAGES_URL: string = import.meta.env.VITE_MEDIUM_IMAGES_URL;
const REMOTE_LARGE_IMAGES_URL: string = import.meta.env.VITE_LARGE_IMAGES_URL;

const APP_ENV = {
    REMOTE_BASE_URL,
    REMOTE_SMALL_IMAGES_URL,
    REMOTE_MEDIUM_IMAGES_URL,
    REMOTE_LARGE_IMAGES_URL,
}
export { APP_ENV };

