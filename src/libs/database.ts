import { Model, FilterQuery } from "mongoose"
import lang from "../lang";

type PaginatorOptions = {
    page?: number|string,
    itemsCount?: number,
    population?: [path: string, select?: string]
}

export async function paginator<T = any> (model: Model<T>, query?: FilterQuery<T>, options?: PaginatorOptions) {
    const page = parseInt (options?.page?.toString() ?? "1")
    const itemsCount = options?.itemsCount ?? 40;
    const skip = (page - 1) * itemsCount

    // Calculo de propiedades de informacion de la paginacion
    const totalPages =  Math.ceil ( await model.find( query || {} ).count() / itemsCount )
    const next = totalPages > page ? page + 1 : null
    const prev = page < 1 ? page - 1 : null

    if ( page < 1 || page > totalPages ) throw new Error(lang.libs.database.pageNotFound);
    

    // Verificar si existe la propiedad populate en las opciones para encadenar el metodo populate
    const items: T[] = options?.population ? await model.find( query || {} ).skip(skip).limit(itemsCount).populate(...options?.population) : await model.find( query || {} ).skip(skip).limit(itemsCount)
    return {
        items,
        next,
        prev,
        page
    }
}