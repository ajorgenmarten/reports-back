import { Model, FilterQuery } from "mongoose"

export function paginator<T = any> (model: Model<T>, query?: FilterQuery<T>, options?: PaginatorOptions) {
    const page = options?.page ?? 1
    const itemsCount = options?.itemsCount ?? 10;
    const skip = (page - 1) * itemsCount
    return model.find( query || {} ).skip(skip).limit(itemsCount)
}

type PaginatorOptions = {
    page?: number,
    itemsCount?: number,
}