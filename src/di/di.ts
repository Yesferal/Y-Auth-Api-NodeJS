/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { AuthDI } from 'y-auth-core-nodejs/lib/di/auth.di'
import { AuthEnv } from 'y-auth-core-nodejs/lib/di/auth.env'
import { PrivateEnv } from '../env/private.env'
import { PublicEnv } from '../env/public.env'
import { AuthNodePackage } from 'y-auth-core-nodejs/lib/framework/node/auth.node.package'
import { ExpressFacade } from '../framework/express/express.facede'
import { Middleware } from '../presentation/middleware/middleware'
import { RateLimitBuilder } from '../framework/rate_limit/rate.limit.builder'
import { HelmetBuilder } from '../framework/helmet/helmet.builder'

export class Di {
    /**
     * AUTH DI
     */
    authDi: AuthDI

    constructor(private publicEnv: PublicEnv, private privateEnv: PrivateEnv, private authEnv: AuthEnv) {
        console.log(`Init with public env: ${JSON.stringify(publicEnv)}`)
        console.log(`Y-Auth Module Version: ${new AuthNodePackage().getVersion()}`)
        this.authDi = new AuthDI(authEnv)
    }

    private middleware: Middleware | undefined
    resolveMiddleware() {
        return this.middleware || (this.middleware = new Middleware(this.privateEnv.Y_AUTH_SECRET_KEY, [this.privateEnv.Y_AUTH_CHALKBET_SECRET_VALUE]))
    }

    private rateLimitBuilder: RateLimitBuilder | undefined
    resolveRateLimitBuilder() {
        return this.rateLimitBuilder || (this.rateLimitBuilder = new RateLimitBuilder()
        .withLimit(this.publicEnv.REQUEST_LIMIT)
        .withWindow(this.publicEnv.REQUEST_WINDOW))
    }

    private expressFacade: ExpressFacade | undefined
    resolveExpressFacade(): ExpressFacade {
        return this.expressFacade || (this.expressFacade = new ExpressFacade(this.authDi?.resolvePasswordlessLoginUseCase(), this.authDi?.resolveGetRefreshTokenUseCase(), this.authDi?.resolveGetAccessTokenUseCase()))
    }

    private helmetBuilder: HelmetBuilder | undefined
    resolveHelmetBuilder(): HelmetBuilder {
        return this.helmetBuilder || (this.helmetBuilder = new HelmetBuilder())
    }
}
