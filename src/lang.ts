export default {
    libs: {
        jsonwebtoken: {
            expired: "Su token ha expirado.",
            invalidSignature: "Su token no es autentico.",
            invalidToken: "Su token no es correcto",
        }
    },
    services: {
        auth: {
            middlewares: {
                existUserWithUsername: "Ya existe un usuario con ese nombre de usuario.",
                existUserWithEmail: "Ya existe un usuario con ese correo."
            },
            controllers: {
                register: "Se ha enviado un mail a su correo, por favor vaya a activar su usuario.",
                resendCodeNotFound: "No se encuentra registrado en el sistema, por favor registrese.",
                loginOk: "Ha iniciado sesión correctamente.",
                loginInactiveAccount: "Su cuenta no ha sido activada aun.",
                loginInvalidUsername: "Credenciales incorrectas.",
                loginInvalidPassword: "Credenciales incorrectas.",
                activeOk: "La cuenta ha sido activada",
                activeNotFound: "La cuenta no existe, por favor verifique sus credenciales.",
            }
        }
    }
}