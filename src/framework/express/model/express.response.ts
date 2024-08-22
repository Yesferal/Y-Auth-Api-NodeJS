/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

interface ExpressResponse {
    message: string
    expressToken?: ExpressToken
}

interface ExpressToken {
    refreshToken?: string
    accessToken?: string
}
