/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { Request, Response, Router } from "express"
import { PublicEnv } from "../../env/public.env"
import { PasswordlessLoginUseCase } from "y-auth-core-nodejs/lib/domain/usecase/auth.passwordless.login.usecase"
import { GetRefreshTokenUseCase } from "y-auth-core-nodejs/lib/domain/usecase/auth.get.refresh.token.usecase"
import { GetAccessTokenUseCase } from "y-auth-core-nodejs/lib/domain/usecase/auth.get.access.token.usecase"
import { ErrorResponseModel, SuccessResponseModel } from "y-auth-core-nodejs/lib/domain/model/response.model"
import { ErrorMessage } from "./model/http.error.message"
import { SuccessMessage, SuccessMessageEn, SuccessMessageEs } from "./model/http.success.message"

export class ExpressFacade {

    constructor(
        private passwordlessLoginUseCase: PasswordlessLoginUseCase,
        private getRefreshTokenUseCase: GetRefreshTokenUseCase,
        private getAccessTokenUseCase: GetAccessTokenUseCase
    ) {}

    getHelloWorld(env: PublicEnv): Router {
        return Router({
            strict: true
        }).get("/", async (req, res) => {
            const locale = req.query.language?.toString()
            
            var message: string = this.pickSuccessMessageBy(locale).successHelloWorld

            res.status(200).json({
                message: message,
                envVar: env
            })
        })
    }

    getPasswordlessLogin(): Router {
        return Router({
            strict: true
        }).get('/:appColor', async (req, res) => {
            try {
                const appColor = req.query.appColor?.toString()
                const appName = req.query.appName?.toString()
                const email = req.query.email?.toString()
                if (!appColor || !appName || !email) {
                    this.sendErrorResponse(res, { message: ErrorMessage.BadRequestMissingParameter + "appColor or appName or email" })
                    return
                }

                const responseModel = await this.passwordlessLoginUseCase.execute(appColor, appName, email)

                switch (true) {
                    case responseModel instanceof SuccessResponseModel: {
                        const locale = req.query.language?.toString()
                        const expressResponse: ExpressResponse = {
                            message: responseModel.value ? responseModel.value : this.pickSuccessMessageBy(locale).successPasswordlessLogin
                        }

                        this.sendSuccessfulResponse(res, expressResponse)
                        break
                    }
                    case responseModel instanceof ErrorResponseModel: {
                        this.sendErrorResponse(res, responseModel)
                        break
                    }
                    default: {
                        this.sendErrorResponse(res, { message: ErrorMessage.BadResponseModelUndefined })
                        break
                    }
                }
            } catch (e) {
                console.log(e)
                this.sendErrorResponse(res, { message: ErrorMessage.BadRequest })
            }
        })
    }

    getRefreshToken(): Router {
        return Router({
            strict: true
        }).get('/:email', async (req, res) => {
            try {
                const email = req.query.email?.toString()
                const authCode = req.query.authCode?.toString()
                const deviceId = req.query.deviceId?.toString()
                const appPackageName = req.query.appPackageName?.toString()
                if (!email || !authCode || !deviceId || !appPackageName) {
                    this.sendErrorResponse(res, { message: ErrorMessage.BadRequestMissingParameter + `email or authCode or deviceId or appPackageName` })
                    return
                }

                const refreshResponseModel = await this.getRefreshTokenUseCase.execute(email, authCode, deviceId, appPackageName, "30d")

                switch (true) {
                    case refreshResponseModel instanceof SuccessResponseModel: {
                        this._getAccessToken(req, res, refreshResponseModel.value)
                        break
                    }
                    case refreshResponseModel instanceof ErrorResponseModel : {
                        this.sendErrorResponse(res, refreshResponseModel)
                        break
                    }
                    default: {
                        this.sendErrorResponse(res, { message: ErrorMessage.BadResponseModelUndefined })
                        break
                    }
                }
            } catch (e) {
                console.log(e)
                this.sendErrorResponse(res, { message: ErrorMessage.BadRequest })
            }
        })
    }

    getAccessToken(): Router {
        return Router({
            strict: true
        }).get('/:refreshToken', async (req, res) => {
            try {
                const refreshToken = req.query.refreshToken?.toString()
                this._getAccessToken(req, res, refreshToken)
            } catch (e) {
                console.log(e)
                this.sendErrorResponse(res, { message: ErrorMessage.BadRequest })
            }
        })
    }

    private async _getAccessToken(req: Request, res: Response, refreshToken?: string) {
        if (!refreshToken) {
            this.sendErrorResponse(res, { message: ErrorMessage.BadRequestMissingParameter + `refreshToken` })
            return
        }

        const responseModel = await this.getAccessTokenUseCase.execute(refreshToken, "15m")

        switch (true) {
            case responseModel instanceof SuccessResponseModel: {
                const locale = req.query.language?.toString()
                const expressResponse: ExpressResponse = {
                    message: this.pickSuccessMessageBy(locale).successToken,
                    expressToken: {
                        refreshToken: refreshToken,
                        accessToken: responseModel.value
                    }
                }

                this.sendSuccessfulResponse(res, expressResponse)
                break
            }
            case responseModel instanceof ErrorResponseModel: {
                this.sendErrorResponse(res, responseModel)
                break
            }
            default: {
                this.sendErrorResponse(res, { message: ErrorMessage.BadResponseModelUndefined })
                break
            }
        }
    }

    private pickSuccessMessageBy(locale?: string): SuccessMessage {
        return locale == 'es' ? new SuccessMessageEs() : new SuccessMessageEn()
    }

    private sendSuccessfulResponse(res: Response, expressResponse: ExpressResponse) {
        res.status(200).json(expressResponse)
    }

    private sendErrorResponse(res: Response, errorResponseModel: ErrorResponseModel) {
        const statusCode = errorResponseModel.code != undefined ? errorResponseModel.code : 400

        res.status(statusCode).json({
            statusCode: statusCode,
            message: errorResponseModel.message,
            longDescription: errorResponseModel.longDescription
        })
    }
}
