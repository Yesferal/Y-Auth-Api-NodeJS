/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import rateLimit, { RateLimitRequestHandler } from "express-rate-limit"
import { ErrorResponseModel } from "y-auth-core-nodejs/lib/domain/model/response.model"

export class RateLimitBuilder {
    private limit: number = 15
    private window: number = 5

    withLimit(
        limit: number
    ): RateLimitBuilder {
        this.limit = limit

        return this
    }

    withWindow(
        window: number
    ): RateLimitBuilder {
        this.window = window

        return this
    }

    build(): RateLimitRequestHandler {
        console.log(`using: ${this.window} window with ${this.limit} limit`)
        return rateLimit({
            windowMs: this.window * 60 * 1000, // {this.minutes} minutes in millis
            limit: this.limit, // each IP can make up to {this.limit} requests per `windowsMs` ({this.minutes} minutes)
            standardHeaders: 'draft-7', // add the `RateLimit-*` headers to the response
            legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
            handler: (req, res) => {
                res.status(429).send(ErrorResponseModel.getTooManyRequestResponseWith('Too many requests, please try again later', "Plase try again later"))
            },
        })
    }
}
