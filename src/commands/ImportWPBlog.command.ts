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
import { BlogPostAdminService } from 'src/blog/post/admin/blogPost.admin.service';
import { CreateBlogPostDto } from 'src/blog/post/admin/dto/createBlogPost.dto';




@Injectable()
export class ImportWPBlogCommand {
    constructor(
        private readonly http: HttpService,
        private storageService: StorageService,
        private userService: UserService,
        private blogPostService: BlogPostAdminService,
    ) { }

    @Command({
        command: 'import:wpBlog',
        describe: 'import blog post from wordpress',
    })
    async create(
        // @Positional({
        //     name: 'skip',
        //     describe: 'skip index',
        //     type: 'number',
        // })
        // skip: number,
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
        console.log("Importing started");
        const { data } = await this.http.get('https://iranocc.com/wp-json/rapp/v1/exportFiles').toPromise();
        const _all_count = data.length
        const _count = (_all_count - skip) > count ? count : (_all_count - skip)

        console.log("items count:", _all_count)
        console.log("import from:", skip)
        console.log("import count:", _count)

        const me: User = await this.userService.getUserById("64942e083da4c1fbea6bd7c3")

        for (let i = skip; i < _count + skip; i++) {
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
            const n = image.replace("dl.iranocc.com", "iranocc.com")
            image = (await this.uploadByUrl(n, me, RelatedToEnum.Blog))._id.toString()
            // => generate data
            const _data: CreateBlogPostDto = {
                "title": p.title,
                "slug": p.slug,
                "content": content,
                "excerpt": p.title,
                "image": image,
                "tags": p.tags?.map(({ name }) => (name)),
                "categories": p.categories?.map(({ cat_ID }) => {
                    switch (cat_ID) {
                        case 106:
                            return "64d154306970b9d5194639d9"
                        case 104:
                            return "64d1543f6970b9d5194639ec"
                        case 102:
                            return "64d1545c6970b9d5194639ff"
                        case 99:
                            return "64d154a26970b9d519463ac4"
                        case 103:
                            return "64d154d26970b9d519463adb"
                        case 101:
                            return "64d154ea6970b9d519463aee"
                    }
                }),
                "status": "Publish",
                "visibility": "Public",
                "pinned": false,
                "publishedAt": new Date(p.created + " UTC+00:00").toISOString(),
                "office": "649c9097df135411a6c3b622",
                "author": "64942e083da4c1fbea6bd7c3",
            }
            await this.blogPostService.create(_data, me)
            console.log("Imported", (i + 1), "/", _count + skip, "==>", p.id)
        }
        return data
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




