import { BadRequestException, NotAcceptableException, NotFoundException } from "@nestjs/common"

export const FieldAlreadyExists = (field: string) => {
    throw new NotAcceptableException({
        errors: {
            [field]: {
                "FieldAlreadyExists": "Already exists"
            }
        }
    })
}


export const FieldNotFound = (field: string) => {
    throw new NotFoundException({
        errors: {
            [field]: {
                "FieldNotFound": "Not Found"
            }
        }
    })
}