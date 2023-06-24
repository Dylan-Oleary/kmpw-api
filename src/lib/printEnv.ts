/**
 * Prints the nevironment variables to the console.
 * This function is useful in building a starting splash screen.
 */
const printEnv: () => void = () => {
    const packageName = `${process.env.npm_package_name}:${process.env.COMMIT_SHA}`;

    console.info("");
    console.info(":".repeat(packageName.length));
    console.info(packageName);
    console.info(":".repeat(packageName.length));
    console.info("");
    console.info(`Environment: ${process.env.NODE_ENV}`);
    console.info("");

    const envKeys = [
        "ACCESS_TOKEN_LIFESPAN",
        "REFRESH_TOKEN_LIFESPAN",
        "DOG_API_BASE_URL",
        "WEATHER_API_BASE_URL",
        "WEATHER_CACHE_LIFESPAN",
        "WEATHER_CACHE_DISTANCE_METRES",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_FOLDER_PREFIX",
        "USER_MAX_NUM_OF_DOGS",
        "WEATHER_API_SEVERE_ALERT_CODES",
        "WEATHER_API_MODERATE_ALERT_CODES",
        "AWS_REKOGNITION",
        "AWS_REKOGNITION_REGION",
        "SENTRY_ENABLED",
        "SENTRY_DSN",
        "SENTRY_SAMPLE_RATE"
    ];

    envKeys.sort();

    const longestKey = envKeys.reduce(function (a, b) {
        return a.length > b.length ? a : b;
    });

    envKeys.forEach((key) => {
        console.info(`ENV: ${key.padEnd(longestKey.length, " ")} -> ${process.env[key]}`);
    });

    console.info("");
};

export default printEnv;
export { printEnv };
