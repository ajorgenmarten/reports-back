import nodemailer from 'nodemailer'
import fs from 'fs'

import { MAILER_CONFIG } from '../config'

export const Mailer = nodemailer.createTransport(MAILER_CONFIG)

export const loadMailTemplate = (templatePath: string, replaces?: any) => {
    let mailTemplateString = fs.readFileSync(`./src/templates/${templatePath}.html`).toString()
    if ( replaces === undefined ) return mailTemplateString

    const regExpString = Object.keys(replaces).map(keyName => `{{${keyName}}}`).join('|')
    const regExp = new RegExp(`${regExpString}`, 'g') 
    return mailTemplateString.replace(regExp, (match) => {        
        return replaces[match.replace(/[{}]/g, "").trim()]
    })
}

export const isReady = async() => {
    try {
        return await Mailer.verify()
    } catch {
        return false
    }
}
