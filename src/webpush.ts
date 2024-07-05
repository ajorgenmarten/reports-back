import webpush from 'web-push'
import mongose from 'mongoose'
import { WEBPUSH_PRIVATE_KEY, WEBPUSH_PUBLIC_KEY, MAIL_USER } from './config'

try {
    webpush.setVapidDetails('mailto:'+MAIL_USER, WEBPUSH_PUBLIC_KEY, WEBPUSH_PRIVATE_KEY)
} catch (err) {
    console.error((err as Error).message)
    setTimeout(() => {
        mongose.disconnect()
        process.exit()
    }, 3000);
}

export default webpush