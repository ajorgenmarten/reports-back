import fs from 'fs'
import { Router } from 'express'

const router = Router()
const path = __dirname + "/../services"

fs.readdirSync(path).forEach(moduleName => {
    if (!fs.existsSync(`${path}/${moduleName}/routes.ts`)) return;
    import(`${path}/${moduleName}/routes`).then(module => {
        router.use(`/${moduleName}`,module.router)
        console.log(`🧱 Module ${moduleName} has been loaded`);
    })
})

export { router }