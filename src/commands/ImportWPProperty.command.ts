import { Command, Positional, Option } from 'nestjs-command';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RelatedToEnum } from 'src/utils/enum/relatedTo.enum';
import { get } from 'https';
import { Readable } from 'stream';
import { StorageService } from 'src/storage/storage.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { Storage } from 'src/storage/schemas/storage.schema';
import { Types } from 'mongoose';
import { CreateEstateDto } from 'src/estate/estate/admin/dto/createEstate.dto';
import { EstateAdminService } from 'src/estate/estate/admin/estate.admin.service';


// CLI_PATH=./dist/cli.js npx nestjs-command import:wpProperty -p 1 -s 0 -c 1

@Injectable()
export class ImportWPPropertyCommand {
    constructor(
        private readonly http: HttpService,
        private storageService: StorageService,
        private userService: UserService,
        private estateService: EstateAdminService,
    ) { }

    @Command({
        command: 'import:wpProperty',
        describe: 'import Property from wordpress',
    })
    async create(
        @Option({
            name: 'page',
            describe: 'page number',
            type: 'number',
            alias: 'p',
            required: false,
            default: 0
        })
        page: number,
        @Option({
            name: 'skip',
            describe: 'skip index',
            type: 'number',
            alias: 's',
            required: false,
            default: 0
        })
        skip: number,
        @Option({
            name: 'count',
            describe: 'count index',
            type: 'number',
            alias: 'c',
            required: false,
        })
        count?: number
    ) {

        for (let ppp = page; ppp < 68; ppp++) {

            console.log("Importing started");
            const { data } = await this.http.get('https://iranocc.com/wp-json/rapp/v1/exportProperty', { params: { page: ppp } }).toPromise();
            const _all_count = data.length
            const _count = (_all_count - skip) > count ? count : (_all_count - skip)

            console.log("items count:", _all_count)
            console.log("import from:", skip)
            console.log("import count:", _count)

            const me: User = await this.userService.getUserById("64942e083da4c1fbea6bd7c3")

            for (let i = 0; i < _all_count; i++) {
                const p = data[i];
                let content: string = p.content
                const pattern = /<img[^>]+src="([^">]+)"/g
                let match: any
                // content
                while ((match = pattern.exec(content))) {
                    const u = match[1]
                    const n = u.replace("dl.iranocc.com", "iranocc.com")
                    const m = await this.uploadByUrl(n, me, RelatedToEnum.Blog)
                    content = content.replace(u, "https://storage.iranocc.com/" + m.path)
                }
                // thumbnail
                let image: string = p.image
                if (!!image) {
                    const n = image.replace("dl.iranocc.com", "iranocc.com")
                    image = (await this.uploadByUrl(n, me, RelatedToEnum.Estate))._id.toString()
                }

                // 
                const ptype = p.type
                const pfeatures = p.features
                const pcity = p.city
                // 

                let category = null
                let type = null
                let documentType = null
                let features = []
                for (let i = 0; i < ptype.length; i++) {
                    switch (ptype[i].term_id) {
                        // hectare
                        case 265:
                            category = "645cd1844b4819ffd958c95e"
                            pfeatures.map(({ term_id }) => {
                                switch (term_id) {
                                    // ========================> features
                                    // داخل بافت
                                    case 79:
                                        features = ["64a1ca0be1385b7cf6c99005"]
                                        break;
                                    // خارج بافت
                                    case 273:
                                        features = ["64a1d1c1e1385b7cf6c99021"]
                                        break;
                                    // الحاق بافت
                                    case 275:
                                        features = ["64a1d1b2e1385b7cf6c9901e"]
                                        break;
                                    // =======================> type
                                    // کاربری مسکونی
                                    case 94:
                                        type = "645d77a54df9dc306ef4ac0e"
                                        break;
                                    // ساحلی
                                    case 82:
                                        type = "645d77fe4df9dc306ef4ac1e"
                                        break;
                                    // کاربری باغات
                                    case 122:
                                        type = "645d78274df9dc306ef4ac26"
                                        break;
                                    // کاربری تجاری
                                    case 98:
                                        type = "645d77f04df9dc306ef4ac1a"
                                        break;
                                    // کاربری جنگل جلگه ای
                                    case 96:
                                        type = "645d77d54df9dc306ef4ac16"
                                        break;
                                    // کاربری زراعی کشاورزی
                                    case 272:
                                        type = "645d77be4df9dc306ef4ac12"
                                        break;
                                }
                            })
                            break;
                        // land
                        case 57:
                            category = "645cd1554b4819ffd958c958"
                            pfeatures.map(({ term_id }) => {
                                switch (term_id) {
                                    // ========================> features
                                    // داخل بافت
                                    case 79:
                                        features = ["64a1ca0be1385b7cf6c99005"]
                                        break;
                                    // خارج بافت
                                    case 273:
                                        features = ["64a1d1c1e1385b7cf6c99021"]
                                        break;
                                    // الحاق بافت
                                    case 275:
                                        features = ["64a1d1b2e1385b7cf6c9901e"]
                                        break;
                                    // =======================> type
                                    // کاربری مسکونی
                                    case 94:
                                        type = "645d77a54df9dc306ef4ac0e"
                                        break;
                                    // ساحلی
                                    case 82:
                                        type = "645d77fe4df9dc306ef4ac1e"
                                        break;
                                    // کاربری باغات
                                    case 122:
                                        type = "645d78274df9dc306ef4ac26"
                                        break;
                                    // کاربری تجاری
                                    case 98:
                                        type = "645d77f04df9dc306ef4ac1a"
                                        break;
                                    // کاربری جنگل جلگه ای
                                    case 96:
                                        type = "645d77d54df9dc306ef4ac16"
                                        break;
                                    // کاربری زراعی کشاورزی
                                    case 272:
                                        type = "645d77be4df9dc306ef4ac12"
                                        break;
                                }
                            })
                            break;
                        // ==== commercial
                        case 24:
                        case 40:
                        case 43:
                            category = "645cd1754b4819ffd958c95b"
                            // shop
                            if (ptype[i].term_id === 43) type = "645d78e34df9dc306ef4ac5e"
                            // official
                            else if (ptype[i].term_id === 40) type = "645d78534df9dc306ef4ac2e"
                            // commercial
                            else type = "645d787b4df9dc306ef4ac38"


                            // ==> features

                            break;
                        // ==== apartment
                        case 48:
                        case 47:
                            category = "645cd1214b4819ffd958c955"
                            type = "64627678979b5983b8b7ced2"
                            pfeatures.map(({ term_id }) => {
                                switch (term_id) {
                                    // ========================> features
                                    // آسانسور
                                    case 79:
                                        features.push("645d0c34c4e32bac366cbfce")
                                        break;
                                    // جکوزی
                                    case 273:
                                        features.push("645d0e3398a6fe36672b5730")
                                        break;
                                    // سونا
                                    case 273:
                                        features.push("645d0e4b98a6fe36672b5734")
                                        break;
                                    // انباری
                                    case 273:
                                        features.push("645d0ee798a6fe36672b574c")
                                        break;
                                    // پارکینگ
                                    case 273:
                                        features.push("645d0ef998a6fe36672b5750")
                                        break;
                                    // مبله
                                    case 273:
                                        features.push("645d0f4c98a6fe36672b5781")
                                        break;
                                    // کمد دیواری
                                    case 273:
                                        features.push("645d0f6498a6fe36672b5785")
                                        break;
                                    // ویو
                                    case 273:
                                        features.push("645d0f7598a6fe36672b5789")
                                        break;
                                }
                            })
                            break;
                        // villa
                        case 46:
                        case 42:
                            category = "645cd0444b4819ffd958c940"
                            pfeatures.map(({ term_id }) => {
                                switch (term_id) {
                                    // ========================> features
                                    // آسانسور
                                    case 79:
                                        features.push("645d0c34c4e32bac366cbfce")
                                        break;
                                    // استخر
                                    case 273:
                                        features.push("645d0d9998a6fe36672b5716")
                                        break;
                                    // حیاط سازی
                                    case 275:
                                        features.push("645d0e0398a6fe36672b5728")
                                        break;
                                    // روف گاردن
                                    case 273:
                                        features.push("645d0e1b98a6fe36672b572c")
                                        break;
                                    // جکوزی
                                    case 273:
                                        features.push("645d0e3398a6fe36672b5730")
                                        break;
                                    // سونا
                                    case 273:
                                        features.push("645d0e4b98a6fe36672b5734")
                                        break;
                                    // ساحلی
                                    case 273:
                                        features.push("645d0e6298a6fe36672b5738")
                                        break;
                                    // جنگلی
                                    case 273:
                                        features.push("645d0e7598a6fe36672b573c")
                                        break;
                                    // شهرکی
                                    case 273:
                                        features.push("645d0e8998a6fe36672b5740")
                                        break;
                                    // شاه نشین
                                    case 273:
                                        features.push("645d0eb398a6fe36672b5744")
                                        break;
                                    // فول فرنیش
                                    case 273:
                                        features.push("645d0ec898a6fe36672b5748")
                                        break;
                                    // =======================> type
                                    // فلت
                                    case 288:
                                        type = "645d76884df9dc306ef4abdd"
                                        break;
                                    // دوبلکس
                                    case 80:
                                        type = "645d76c34df9dc306ef4abe1"
                                        break;
                                    // تریبلکس
                                    case 81:
                                        type = "645d77534df9dc306ef4abfa"
                                        break;
                                    // طبقات جداگانه
                                    case 356:
                                        type = "645d776a4df9dc306ef4abfe"
                                        break;
                                }
                            })
                            break;
                    }
                }

                pfeatures.map(({ term_id }) => {
                    switch (term_id) {
                        // ==> documentType
                        // بنجاق
                        case 123:
                            documentType = "645d096cc4e32bac366cbf9e"
                            break;
                        // تک برگ
                        case 95:
                            documentType = "645d0793c4e32bac366cbf6e"
                            break;
                        // شاهی
                        case 403:
                            documentType = "645d0a23c4e32bac366cbfb0"
                            break;
                        // شش دانگ
                        case 70:
                            documentType = "645d07f3c4e32bac366cbf71"
                            break;
                        // قولنامه ای
                        case 414:
                            documentType = "645d09c8c4e32bac366cbfa4"
                            break;
                        // مشاع
                        case 354:
                            documentType = "645d09aac4e32bac366cbfa1"
                            break;
                    }
                })


                let province = ""
                let city = ""
                let district = ""
                let quarter = ""
                pcity.map(({ term_id }) => {
                    switch (term_id) {
                        // تنکابن
                        case 66:
                            city = "تنکابن"
                            break;
                        // چالوس
                        case 62:
                        case 61:
                        case 289:
                            city = "چالوس"
                            if (term_id === 61) {
                                district = "هیچرود"
                            }
                            if (term_id === 289) {
                                district = "رادیو دریا"
                            }
                            break;
                        // رامسر
                        case 67:
                            city = "رامسر"
                            break;
                        // عباس آباد
                        case 64:
                        case 125:
                            city = "عباس آباد"
                            if (term_id === 125) {
                                district = "کرکاس"
                            }
                            break;
                        // کلارآباد
                        case 59:
                            city = "کلارآباد"
                            break;
                        // کلاردشت
                        case 107:
                        case 60:
                            city = "کلاردشت"
                            if (term_id === 60) {
                                district = "نمک آبرود"
                            }
                            break;
                        // مرزن آباد
                        case 124:
                            city = "مرزن آباد"
                            break;
                        // نشتارود
                        case 65:
                            city = "نشتارود"
                            break;
                        // نوشهر
                        case 100:
                            city = "نوشهر"
                            break;
                        // سلمانشهر
                        case 410:
                        case 63:
                        case 352:
                        case 411:
                            city = "سلمان شهر"
                            if (term_id === 63 || term_id === 352) {
                                district = "متل قو"
                            }
                            if (term_id === 411) {
                                district = "دریاگوشه"
                            }
                            break;
                    }
                    if (city) {
                        province = "مازندران"
                        if (!district) district = city
                        quarter = district
                    }
                })


                let gallery = p.gallery.map(async (img: string) => {
                    const n = img.replace("dl.iranocc.com", "iranocc.com")
                    return (await this.uploadByUrl(n, me, RelatedToEnum.Estate))._id.toString()
                })




                if (!image && !!p.gallery.length) {
                    image = gallery[0]
                }
                else if (image && !p.gallery.length) {
                    gallery.push(image)
                }

                // => generate data
                const _data: CreateEstateDto = {
                    "title": p.title,
                    "slug": decodeURI(p.slug),
                    "content": content,
                    "excerpt": p.title,
                    "image": image,
                    "tags": p.tags ? p.tags?.map(({ name }) => (name)) : [],
                    "status": "Publish",
                    "visibility": "Public",
                    "pinned": false,
                    "publishedAt": new Date(p.created + " UTC+00:00").toISOString(),
                    "office": "649c9097df135411a6c3b622",
                    "owner": "64942e083da4c1fbea6bd7c3",
                    gallery,
                    category,
                    type,
                    documentType,
                    features,

                    province,
                    city,
                    district,
                    quarter,
                    location: !!p.location ? p.location.split(",").slice(0, 2).join(",") : undefined,


                    area: +p.area || undefined,
                    buildingArea: +p.buildingArea || undefined,
                    constructionYear: +p.constructionYear || undefined,
                    roomsCount: +p.roomsCount || undefined
                }
                await this.estateService.create(_data, me)
                console.log("Imported", (ppp * 100) + (i + 1), "/", (ppp * 100) + _count + skip, "==>", p.id)
            }
            return data
        }
    }



    uploadByUrl = async (url: string, user: User, relatedTo: RelatedToEnum): Promise<Storage & { _id: Types.ObjectId }> => {
        const data: Uint8Array[] = []
        return new Promise((resolve, reject) => {
            get(url, (result) => {
                result.on("data", (chunk: Uint8Array) => {
                    data.push(chunk)
                })
                result.on("end", async () => {
                    const buffer = Buffer.concat(data)
                    const image: Express.Multer.File = {
                        buffer,
                        fieldname: '',
                        originalname: url.split("/").reverse()[0],
                        encoding: '',
                        mimetype: result.headers['content-type'],
                        size: buffer.length,
                        stream: new Readable,
                        destination: '',
                        filename: url.split("/").reverse()[0],
                        path: url
                    }
                    const up = await this.storageService.create(image, user, relatedTo)
                    resolve(up)
                })
                result.on("error", () => {
                    throw new NotAcceptableException("Cant Upload this file", "UploadErrorUrl")
                })
            })
        })
    }


}




