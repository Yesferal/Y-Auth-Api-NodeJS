/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { AuthDI } from 'y-auth-nodejs/lib/di/auth.di'
import { AuthEnv } from 'y-auth-nodejs/lib/di/auth.env'
import { PrivateEnv } from '../env/private.env'
import { PublicEnv } from '../env/public.env'
import { AuthNodePackage } from 'y-auth-nodejs/lib/framework/node/auth.node.package'

export class Di {
    /**
     * AUTH DI
     */
    authDi: AuthDI | undefined

    constructor(private publicEnv: PublicEnv, private privateEnv: PrivateEnv, private authEnv: AuthEnv) {
        console.log(`Init with public env: ${JSON.stringify(publicEnv)}`)
        console.log(`Y-Auth Module Version: ${new AuthNodePackage().getVersion()}`)
        this.authDi = new AuthDI(authEnv)
    }
}
