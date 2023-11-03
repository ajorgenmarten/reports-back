import mongoose from "mongoose";

import { DB } from "./config";

mongoose.connect(DB as string)
    .then(() => console.log('connected to database.'))
    .catch(e => {
        console.log('error to connect to database.')
        console.log(e)
        process.exit()
    })