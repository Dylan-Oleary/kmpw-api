require("dotenv").config();
import "module-alias/register";

import { printEnv } from "lib";
import { initializeApplication } from "root/application";

printEnv();

const PORT = process?.env?.PORT || 3000;

initializeApplication().then((app) => {
    app.listen(PORT, () => {
        console.info(`Application listening on http://localhost:${PORT}`);
        console.info(`GraphQL listening on http://localhost:${PORT}/gql`);
    });
});
