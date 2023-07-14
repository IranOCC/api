import mongoose from "mongoose"
import { I18nService } from "nestjs-i18n"
import { PaginationDto } from "../dto/pagination.dto"


// db path select isArray pipelines
export type PopulatedType = [string, string, string?, boolean?, any[]?]

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

        filterRoot?: {},
        newRoot?: string,
        newRootPipelines?: any[],
    ) => {
        let $pipelines: mongoose.PipelineStage[] = []
        let $project = {}

        // populate
        populate.map(([db, path, select, isArray, $pipes = []]) => {
            let project = {}
            select?.split(" ").map((p) => { project[p] = true })
            const $p = !!select?.length ? [{ $project: project }] : []
            $pipelines.push({
                $lookup: {
                    from: db,
                    as: path,
                    localField: path,
                    foreignField: "_id",
                    pipeline: [...$pipes, ...$p]
                }
            })
            console.log(path, db, isArray);

            if (!isArray) $project[path] = { $first: `$${path}` }
            else $project[path] = `$${path}`
        })
        select?.split(" ").map((path) => { $project[path] = `$${path}` })

        console.log($pipelines[0]["$lookup"]);



        // virtualFields
        if (!!Object.keys(virtualFields)?.length) $pipelines.push({ $addFields: virtualFields })



        // search & filter
        let $and = []
        if (!!newRoot) {
            if (!!filterRoot && !!Object.keys(filterRoot).length) $and.push(filterRoot)
            if ($and.length) {
                $pipelines.push({
                    $match: { $and }
                })
            }
        }
        else {
            if (!!filter && !!Object.keys(filter).length) $and.push(filter)
            if (!!searchFields && !!search) {
                $and.push({
                    $or: searchFields.split(" ").map((path) => ({ [path]: { $regex: search, $options: "i" } }))
                })
            }
            if ($and.length) {
                $pipelines.push({
                    $match: { $and }
                })
            }
        }




        // sort
        if (!!sort && !!Object.keys(sort)?.length) $pipelines.push({ $sort: sort })
        else $pipelines.push({ $sort: { createdAt: -1 } })

        // project
        $pipelines.push({ $project })



        // change root
        if (newRoot) {
            $pipelines.push({
                $unwind: "$" + newRoot
            })
            if (!!newRootPipelines?.length) $pipelines.push(...newRootPipelines)
            $pipelines.push({
                $replaceRoot: {
                    "newRoot": "$" + newRoot
                }
            })
        }


        // search & filtering when new root
        $and = []
        if (!!newRoot) {
            if (!!filter && !!Object.keys(filter).length) $and.push(filter)
            if (!!searchFields && !!search) {
                $and.push({
                    $or: searchFields.split(" ").map((path) => ({ [path]: { $regex: search, $options: "i" } }))
                })
            }
            if ($and.length) {
                $pipelines.push({
                    $match: { $and }
                })
            }
        }



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


        return (await model.aggregate($pipelines))[0] || {}


    }

export { listAggregation }