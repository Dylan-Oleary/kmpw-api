/**
 * Prints the nevironment variables to the console.
 * This function is useful in building a starting splash screen.
 */
const printEnv: () => void = () => {
    const packageName = `${process.env.npm_package_name}:${process.env.npm_package_version}`;

    console.info("");
    console.info(":".repeat(packageName.length));
    console.info(packageName);
    console.info(":".repeat(packageName.length));
    console.info("");
    console.info(`Environment: ${process.env.NODE_ENV}`);

    const envKeys = [
        "PORT",
        "REDIS_PORT",
        "ACCESS_TOKEN_SECRET",
        "ACCESS_TOKEN_LIFESPAN",
        "REFRESH_TOKEN_SECRET",
        "REFRESH_TOKEN_LIFESPAN"
    ];

    envKeys.sort();

    const longestKey = envKeys.reduce(function (a, b) {
        return a.length > b.length ? a : b;
    });

    envKeys.forEach((key) => {
        console.info(`ENV: ${key.padEnd(longestKey.length, " ")} -> ${process.env[key]}`);
    });
};

export default printEnv;
export { printEnv };
