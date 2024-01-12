import mongoose from "mongoose";

import { DB } from "./config";

mongoose.connect(DB as string)
    .then(() => console.log('💾 Connected to database.'))
    .catch(e => {
        console.log('❌ Error to connect to database.')
        console.log(e)
        process.exit()
    })