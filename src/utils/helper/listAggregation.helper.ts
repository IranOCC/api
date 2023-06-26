import mongoose from "mongoose"
import { I18nService } from "nestjs-i18n"
import { PaginationDto } from "../dto/pagination.dto"


// db path select isArray
export type PopulatedType = [string, string, string?, boolean?]

const listAggregation =
    (
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
        select?.split(" ").map((path) => { $project[path] = true })





        $pipelines.push({ $addFields: virtualFields })



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

        // project
        $pipelines.push({ $project })


        // pagination
        $pipelines.push({ $skip: (current - 1) * size })
        $pipelines.push({ $limit: size })


        console.log($pipelines);



        return model.aggregate($pipelines).exec()

        // return model.aggregate([
        //     // {
        //     //     $match: {
        //     //         $or: [
        //     //             { fullName: { $regex: search, $options: "i" } },
        //     //             // { _id: new mongoose.Types.ObjectId(initial) }
        //     //         ]
        //     //     }
        //     // },


        // ]).exec()
    }

export { listAggregation }