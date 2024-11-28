/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { MessageResponseModel } from "y-auth-core-nodejs/lib/domain/model/response.model"

export interface ExpressResponse {
    messages?: MessageResponseModel
    email?: string
    expressToken?: ExpressToken
}

interface ExpressToken {
    refreshToken?: string
    accessToken?: string,
    expiredIn?: number
}
