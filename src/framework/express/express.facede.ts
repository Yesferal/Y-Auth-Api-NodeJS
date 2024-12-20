/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

import { Request, Response, Router } from "express"
import { PublicEnv } from "../../env/public.env"
import { PasswordlessLoginUseCase } from "y-auth-core-nodejs/lib/domain/usecase/auth.passwordless.login.usecase"
import { GetRefreshTokenUseCase } from "y-auth-core-nodejs/lib/domain/usecase/auth.get.refresh.token.usecase"
import { GetAccessTokenUseCase } from "y-auth-core-nodejs/lib/domain/usecase/auth.get.access.token.usecase"
import { ErrorResponseModel, SuccessResponseModel } from "y-auth-core-nodejs/lib/domain/model/response.model"
import { ErrorMessage } from "./model/http.error.message"
import { ExpressResponse } from "./model/express.response"
import { SuccessMessage, SuccessMessageEn, SuccessMessageEs } from "./model/http.success.message"

export class ExpressFacade {

    refreshTokenExpiredIn = 0

    accessTokenExpiredIn = 5 /* minutes */ * 60 /* seconds */ * 1000

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
                    this.sendErrorResponse(res, {
                        messages: {
                            infoMessage: ErrorMessage.BadRequestMissingParameter + "appColor or appName or email"
                        }
                    })
                    return
                }

                const responseModel = await this.passwordlessLoginUseCase.execute(appColor, appName, email)

                switch (true) {
                    case responseModel instanceof SuccessResponseModel: {
                        const locale = req.query.language?.toString()
                        const expressResponse: ExpressResponse = {
                            messages: {
                                displayMessage: responseModel.value ? responseModel.value : this.pickSuccessMessageBy(locale).successPasswordlessLogin
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
                        this.sendErrorResponse(res, {
                            messages: {
                                infoMessage: ErrorMessage.BadResponseModelUndefined
                            }
                        })
                        break
                    }
                }
            } catch (e) {
                console.log(e)
                this.sendErrorResponse(res, {
                    messages: {
                        infoMessage: ErrorMessage.BadRequest
                    }
                })
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
                    this.sendErrorResponse(res, {
                        messages: {
                            infoMessage: ErrorMessage.BadRequestMissingParameter + `email or authCode or deviceId or appPackageName`
                        }
                    })
                    return
                }

                const refreshResponseModel = await this.getRefreshTokenUseCase.execute(email, authCode, deviceId, appPackageName, this.refreshTokenExpiredIn)

                switch (true) {
                    case refreshResponseModel instanceof SuccessResponseModel: {
                        if (refreshResponseModel.value) {
                            this._getAccessToken(req, res, refreshResponseModel.value, this.accessTokenExpiredIn, email)
                        } else {
                            this.sendErrorResponse(res, {
                                messages: {
                                    infoMessage: ErrorMessage.BadResponseModelUndefined
                                }
                            })
                        }
                        break
                    }
                    case refreshResponseModel instanceof ErrorResponseModel: {
                        this.sendErrorResponse(res, refreshResponseModel)
                        break
                    }
                    default: {
                        this.sendErrorResponse(res, {
                            messages: {
                                infoMessage: ErrorMessage.BadResponseModelUndefined
                            }
                        })
                        break
                    }
                }
            } catch (e) {
                console.log(e)
                this.sendErrorResponse(res, {
                    messages: {
                        infoMessage: ErrorMessage.BadRequest
                    }
                })
            }
        })
    }

    getAccessToken(): Router {
        return Router({
            strict: true
        }).get('/:refreshToken', async (req, res) => {
            try {
                const refreshToken = req.query.refreshToken?.toString()
                if (refreshToken) {
                    this._getAccessToken(req, res, refreshToken, this.accessTokenExpiredIn)
                } else {
                    this.sendErrorResponse(res, {
                        messages: {
                            infoMessage: ErrorMessage.BadRequestMissingParameter + "RefreshToken"
                        }
                    })
                }
            } catch (e) {
                console.log(e)
                this.sendErrorResponse(res, {
                    messages: {
                        infoMessage: ErrorMessage.BadRequest
                    }
                })
            }
        })
    }

    private async _getAccessToken(req: Request, res: Response, refreshToken: string, expiredIn: number, email?: string) {
        if (!refreshToken) {
            this.sendErrorResponse(res, {
                messages: {
                    infoMessage: ErrorMessage.BadRequestMissingParameter + `refreshToken`
                }
            })
            return
        }

        const responseModel = await this.getAccessTokenUseCase.execute(refreshToken, expiredIn)

        switch (true) {
            case responseModel instanceof SuccessResponseModel: {
                const locale = req.query.language?.toString()
                const expressResponse: ExpressResponse = {
                    messages: {
                        infoMessage: this.pickSuccessMessageBy(locale).successToken,
                    },
                    email: email,
                    expressToken: {
                        refreshToken: refreshToken,
                        accessToken: responseModel.value,
                        expiredIn: expiredIn
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
                this.sendErrorResponse(res, {
                    messages: {
                        infoMessage: ErrorMessage.BadResponseModelUndefined
                    }
                })
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

        res.status(statusCode).json(errorResponseModel)
    }
}
