import mongoose from "mongoose"
import { I18nService } from "nestjs-i18n"
import { AutoCompleteDto } from "../dto/autoComplete.dto"
import { PaginationDto } from "../dto/pagination.dto"


// db path select isArray
export type PopulatedType = [string, string, string?, boolean?]

const listAutoComplete =
    (
        model: mongoose.Model<any, {}, {}, {}, any>,
        { initial, current, size, search, }: AutoCompleteDto,
        searchFields: string,
        displayPath: string,
        virtualFields?: {},
        filter?: {},
        // sort?: {},
        // populate: PopulatedType[] = [],
    ) => {
        let $pipelines: mongoose.PipelineStage[] = []


        // virtualFields
        if (!!Object.keys(virtualFields)?.length) $pipelines.push({ $addFields: virtualFields })



        // Search & Filter
        if (!!searchFields) {
            let $and = []
            if (filter) $and.push(filter)
            $and.push({
                $or: [
                    ...searchFields.split(" ").map((path) => ({ [path]: { $regex: search, $options: "i" } })),
                    { _id: new mongoose.Types.ObjectId(initial) }
                ]
            })
            $pipelines.push({
                $match: { $and }
            })
        }


        // Convert to autoComplete
        $pipelines.push({
            $project: {
                _id: 0,
                title: ("$" + displayPath),
                value: "$_id",
                isInitial: {
                    $cond: [
                        { $eq: ["$_id", new mongoose.Types.ObjectId(initial)] },
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