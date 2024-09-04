import { RequestHandler } from "express"
import helmet from "helmet"

export class HelmetBuilder {
    build(): RequestHandler {
        return helmet()
    }
}
