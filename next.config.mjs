/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        BASE_URL_ENDPOINT: process.env.BASE_URL_ENDPOINT,
        FTP_FILE_PATH: process.env.FTP_FILE_PATH
    },
};

export default nextConfig;
