const env = import.meta.env;
const url = import.meta.env.VITE_API_URL;
const key = import.meta.env.VITE_API_KEY;
const { VITE_API_URL, VITE_API_KEY } = import.meta.env;
const str = `${import.meta.env.VITE_API_URL}/api?key=${import.meta.env.VITE_API_KEY}`;
const currentEnv = import.meta.env.VITE_API_ENV;