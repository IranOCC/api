import { I18nService } from "nestjs-i18n"

const translateStatics = (i18nService: I18nService<Record<string, unknown>>, name: string, _enum: any = {}) => {
    return Object.keys(_enum).map((v) => ({ title: i18nService.t(`statics.${name}.${_enum[v]}`), value: v }))
}

export { translateStatics }