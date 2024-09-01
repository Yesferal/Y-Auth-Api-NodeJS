/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { AuthEnv } from 'y-auth-core-nodejs/lib/di/auth.env'
import { PublicEnv } from "../env/public.env"
import { PrivateEnv } from "../env/private.env"
import { Di } from "../di/di"
import { AuthNodePackage } from "y-auth-core-nodejs/lib/framework/node/auth.node.package"
import { ExpressServerBuilder } from "../framework/express/express.server.builder"

/**
 * Public Environment Variables
 */
const env: PublicEnv = {
    PORT: process.env.PORT || '',
    APP_VERSION: process.env.npm_package_version || '',
    CORE_VERSION: new AuthNodePackage().getVersion()
}

/**
 * Private Environment Variables
 */
const privateEnv: PrivateEnv = {
    Y_AUTH_SECRET_KEY: process.env.Y_AUTH_SECRET_KEY || '',
    Y_AUTH_CHALKBET_SECRET_VALUE: process.env.Y_AUTH_CHALKBET_SECRET_VALUE || ''
}

/**
 * Auth Private Environment Variables
 */
const authEnv: AuthEnv = {
    DB_URL: process.env.DB_URL || '',
    DB_NAME: process.env.DB_NAME || '',
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY || '',
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY || '',
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL_PORT: Number(process.env.EMAIL_PORT) || 666,
    EMAIL_ACCOUNT: process.env.EMAIL_ACCOUNT || '',
    EMAIL_PASS: process.env.EMAIL_PASS || ''
}

const di = new Di(env, privateEnv, authEnv)

new ExpressServerBuilder()
    .withPort(env.PORT)
    .withMiddleware(di.resolveMiddleware())
    .register('/', di.resolveExpressFacade().getHelloWorld(env))
    .registerPrivate('/passwordless_login', di.resolveExpressFacade().getPasswordlessLogin())
    .registerPrivate('/get_refresh_token', di.resolveExpressFacade().getRefreshToken())
    .registerPrivate('/get_access_token', di.resolveExpressFacade().getAccessToken())
    .build()
