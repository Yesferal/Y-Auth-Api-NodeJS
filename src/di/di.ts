/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { AuthDI } from 'y-auth-nodejs/lib/di/auth.di'
import { AuthEnv } from 'y-auth-nodejs/lib/di/auth.env'
import { PrivateEnv } from '../env/private.env'
import { PublicEnv } from '../env/public.env'
import { AuthNodePackage } from 'y-auth-nodejs/lib/framework/node/auth.node.package'
import { ExpressFacade } from '../framework/express/express.facede'
import { Middleware } from '../presentation/middleware/middleware'

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

    private expressFacade: ExpressFacade | undefined
    resolveExpressFacade(): ExpressFacade {
        return this.expressFacade || (this.expressFacade = new ExpressFacade(this.authDi?.resolvePasswordlessLoginUseCase(), this.authDi?.resolveGetRefreshTokenUseCase(), this.authDi?.resolveGetAccessTokenUseCase()))
    }
}
