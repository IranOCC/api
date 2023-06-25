import { ValidationError } from "class-validator";
import { I18nValidationException } from "nestjs-i18n";

const MongoCreationError = (i18n) => (err) => {
    if (err.code === 11000) {
        const k = Object.keys(err.keyValue)
        const path = k[0]
        const val = k[path]
        const _error = new ValidationError();
        _error.property = path;
        _error.constraints = {
            DuplicateError: i18n.t("exception.DuplicateError")
        };
        _error.value = val;
        throw new I18nValidationException([_error])
    }
}

export { MongoCreationError }