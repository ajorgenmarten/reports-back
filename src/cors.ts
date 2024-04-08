import { ORIGINS } from "./config"
import { CorsOptions } from 'cors'
import lang from "./lang"

export const handleCors: CorsOptions['origin'] = function( origin, callback ) {
    const requestOrigin = origin ?? ''
    if ( ORIGINS.includes( requestOrigin ) )
        callback(null, true)
    else
        callback(new Error(lang.cors.deny))
}