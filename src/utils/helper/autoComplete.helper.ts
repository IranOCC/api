import mongoose from "mongoose"
import { I18nService } from "nestjs-i18n"
import { AutoCompleteDto } from "../dto/autoComplete.dto"
import { PaginationDto } from "../dto/pagination.dto"
import { PopulatedType } from "./listAggregation.helper"



const listAutoComplete =
    (
        model: mongoose.Model<any, {}, {}, {}, any>,
        { initial, current, size, search, }: AutoCompleteDto,
        searchFields: string,
        displayPath: string,
        virtualFields?: {},
        filter?: {},
        // sort?: {},

        populate: PopulatedType[] = [],

        filterRoot?: {},
        newRoot?: string,
        newRootPipelines?: any[],

    ) => {
        let $pipelines: mongoose.PipelineStage[] = []

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
            // if (!isArray) $project[path] = { $first: `$${path}` }
            // else $project[path] = `$${path}`
        })

        if (!Array.isArray(initial)) initial = [initial]


        // virtualFields
        if (virtualFields && !!Object.keys(virtualFields)?.length) $pipelines.push({ $addFields: virtualFields })



        // Search & Filter when new root
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
                    $match: {
                        $or: [
                            { _id: { $in: initial?.map(v => new mongoose.Types.ObjectId(v)) } },
                            { $and }
                        ]
                    }
                })
            }
        }





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
                    $match: {
                        $or: [
                            { _id: { $in: initial?.map(v => new mongoose.Types.ObjectId(v)) } },
                            { $and }
                        ]
                    }
                })
            }
        }


        // Convert to autoComplete
        $pipelines.push({
            $project: {
                _id: 0,
                title: ("$" + displayPath),
                value: "$_id",
                isInitial: {
                    $cond: [
                        { $in: ["$_id", initial?.map(v => new mongoose.Types.ObjectId(v))] },
                        1,
                        0
                    ]
                }
            }
        })


        // Final
        $pipelines.push(
            { $skip: (current - 1) * size },
            { $limit: size },
            { $sort: { isInitial: -1 } },
            { $project: { isInitial: 0 } }
        )


        return model.aggregate($pipelines).exec()
    }

export { listAutoComplete }