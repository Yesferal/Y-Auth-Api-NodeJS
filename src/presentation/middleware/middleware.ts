/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { Request, Response } from 'express'
import { ErrorMessage } from '../../framework/express/model/http.error.message'

export class Middleware {

    constructor(private key: string, private secrets: String[]) {}

    verifyAuthorization = (
        request: Request,
        response: Response,
        next: () => any
    ) => {
        const authorization = request.header(this.key)
        if (!authorization) {
            return response.status(401).json({ message: ErrorMessage.Unauthorized })
        }
        if (!this.secrets.some(s => s === authorization)) {
            return response.status(401).json({ message: ErrorMessage.Unauthorized })
        }

        return next()
    }
}
