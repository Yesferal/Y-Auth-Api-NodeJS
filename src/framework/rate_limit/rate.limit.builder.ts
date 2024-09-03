/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import rateLimit, { RateLimitRequestHandler } from "express-rate-limit"

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
        })
    }
}
