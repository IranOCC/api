import mongoose from "mongoose"
import { I18nService } from "nestjs-i18n"
import { PaginationDto } from "../dto/pagination.dto"


// db path select isArray
export type PopulatedType = [string, string, string?, boolean?]

const listAggregation =
    async (
        model: mongoose.Model<any, {}, {}, {}, any>,
        { current, size, search, }: PaginationDto,
        filter?: {},
        sort?: {},
        populate: PopulatedType[] = [],
        select: string = "",
        virtualFields?: {},
        searchFields?: string,
    ) => {
        let $pipelines: mongoose.PipelineStage[] = []
        let $project = {}

        // populate
        populate.map(([db, path, select, isArray]) => {
            let project = {}
            select?.split(" ").map((p) => { project[p] = true })
            const $p = !!select?.length ? [{ $project: project }] : []
            $pipelines.push({
                $lookup: {
                    from: db,
                    as: path,
                    localField: path,
                    foreignField: "_id",
                    pipeline: $p
                }
            })
            if (!isArray) $project[path] = { $first: `$${path}` }
        })
        select?.split(" ").map((path) => { $project[path] = `$${path}` })




        // virtualFields
        if (!!Object.keys(virtualFields)?.length) $pipelines.push({ $addFields: virtualFields })



        // search & filter
        if (!!searchFields) {
            let $and = []
            if (filter) $and.push(filter)
            $and.push({
                $or: searchFields.split(" ").map((path) => ({ [path]: { $regex: search, $options: "i" } }))
            })
            $pipelines.push({
                $match: { $and }
            })
        }



        // sort
        if (!!Object.keys(sort)?.length) $pipelines.push({ $sort: sort })
        else $pipelines.push({ $sort: { createdAt: -1 } })

        // project
        $pipelines.push({ $project })



        // total count
        $pipelines.push({
            $group: {
                _id: null,
                total: { $sum: 1 },
                items: { $push: '$$ROOT' },
            }
        })


        // pagination
        $pipelines.push({
            $project: {
                _id: false,
                total: "$total",
                items: { $slice: ["$items", (current - 1) * size, size] },
            }
        })


        console.log($pipelines);


        return await model.aggregate($pipelines)


    }

export { listAggregation }