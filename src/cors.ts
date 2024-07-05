import { ORIGINS } from "./config"
import { CorsOptions } from 'cors'
import lang from "./lang"

export const handleCors: CorsOptions['origin'] = function( origin, callback ) {
    if (typeof ORIGINS == "string" && ORIGINS == '*')
        callback(null, true)
    if ( ORIGINS.includes( origin ?? '' ) )
        callback(null, true)
    else
        callback(new Error(lang.cors.deny + ` (${origin ?? ''})`))
}