/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import express, { Express, Router } from 'express'
import { Middleware } from '../../presentation/middleware/middleware'

export class ExpressServerBuilder {
    private betApp: Express
    private port: string | undefined
    private middleware: Middleware | undefined

    constructor() {
        this.betApp = express()
    }

    withPort(
        port: string
    ): ExpressServerBuilder {
        this.port = port

        return this
    }

    withMiddleware(
        middleware: Middleware
    ): ExpressServerBuilder {
        this.middleware = middleware

        return this
    }

    register(
        param: string,
        router: Router
    ): ExpressServerBuilder {
        this.betApp.get(param, router)

        return this
    }

    registerPrivate(
        param: string,
        router: Router
    ): ExpressServerBuilder {
        if (this.middleware) {
            this.betApp.get(param, this.middleware.verifyAuthorization, router)
        } else {
            this.betApp.get(param, router)
        }

        return this
    }

    build(): Express {
        this.betApp.use(express.json())
        this.betApp.listen(this.port, () => {
            console.log(`ServerBuilder: Listening on port http://localhost:${this.port}`)
        })

        return this.betApp
    }
}
