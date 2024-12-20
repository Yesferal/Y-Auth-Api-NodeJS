/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import express, { Express, RequestHandler, Router } from 'express'
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

    withRequestHandler(
        requestHandler: RequestHandler[]
    ): ExpressServerBuilder {
        if (requestHandler) {
            this.betApp.use(requestHandler)
        }

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

    registerRateLimit(requestHandler: RequestHandler, numberOfProxies: number) {
        // TODO: Include this in the RateLimitBuilder
        if (requestHandler) {
            this.betApp.use(requestHandler)
            this.betApp.set('trust proxy', numberOfProxies)
            this.betApp.get('/ip', (request, response) => response.send(request.ip))
            this.betApp.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']))
        }  
        // END RateLimitBuilder
   
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
