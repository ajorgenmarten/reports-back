import mongoose from "mongoose";

import { DB, DB_NAME } from "./config";

mongoose.connect(DB as string, { dbName: DB_NAME })
    .then(() => console.log('💾 Connected to database.'))
    .catch(e => {
        console.log('❌ Error to connect to database.')
        console.log(e)
        process.exit()
    })