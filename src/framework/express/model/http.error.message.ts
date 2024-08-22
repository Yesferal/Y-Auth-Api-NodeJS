/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

export enum ErrorMessage {
    BadRequest = `Bad Request. HTTP request that was sent to the server has invalid syntax.`,
    BadResponseModelUndefined = `Bad Request. Express Response was undefined.`,
    BadRequestMissingParameter = `Bad Request. Parameter not found: `,
    Unauthorized = "Unauthorized. User has not been authenticated."
}
