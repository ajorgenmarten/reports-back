import webpush from 'web-push'
import { WEBPUSH_PRIVATE_KEY, WEBPUSH_PUBLIC_KEY, MAIL_USER } from './config'

webpush.setVapidDetails('mailto:'+MAIL_USER, WEBPUSH_PUBLIC_KEY, WEBPUSH_PRIVATE_KEY)

export default webpush