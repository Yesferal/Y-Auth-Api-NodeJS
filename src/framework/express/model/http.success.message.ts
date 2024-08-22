/* Copyright © 2024 Yesferal Cueva. All rights reserved. */

export interface SuccessMessage {
    successHelloWorld: string
    successPasswordlessLogin: string
    successToken: string
}

export class SuccessMessageEn implements SuccessMessage {
    successHelloWorld: string = `Howdy. I am alive!`
    successPasswordlessLogin: string = `An Auth Code was sent to your email.` 
    successToken: string = "Token was created sucessfully"
}

export class SuccessMessageEs implements SuccessMessage  {
    successHelloWorld: string = `Hola. Ahora estoy vivo!`
    successPasswordlessLogin: string = `Un codigo de autenticación fue enviado a tu correo.`
    successToken: string = "Token fue creado con exito. "
}
