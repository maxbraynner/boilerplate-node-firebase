'use strict';

import { Router } from "express";

// import sub-routers
import users from "./users";

const router = Router();

// mount express paths, any addition middleware can be added as well.
// ex. router.use('/pathway', middleware_function, sub-router);

router.use('/users', users);

// Export the router
export default router;