export default {
    libs: {
        jsonwebtoken: {
            expired: "Su token ha expirado.",
            invalidSignature: "Su token no es autentico, yo tambien puedo romper las reglas.",
            invalidToken: "Su token no es correcto.",
        },
        database: {
            pageNotFound: "Esta página no ha sido encontrada."
        }
    },
    services: {
        auth: {
            middlewares: {
                existUserWithUsername: "Ya existe un usuario con ese nombre de usuario.",
                existUserWithEmail: "Ya existe un usuario con ese correo.",
                validateRefreshTokenSigned: "No tiene acceso a este recurso.",
                getAuthUserNotFound: "Su usuario no ha sido encontrado.",
                canUsernamesNotMatch: "Hay algo mal aqui, yo también puedo romper las reglas.",
            },
            controllers: {
                register: "Se ha enviado un mail a su correo, por favor vaya a activar su usuario.",
                resendCodeNotFound: "No se encuentra registrado en el sistema, por favor registrese.",
                loginOk: "Ha iniciado sesión correctamente.",
                loginSessionUnknownDevice: "Dispositivo desconocido.",
                loginInactiveAccount: "Su cuenta no ha sido activada aun.",
                loginInvalidUsername: "Credenciales incorrectas.",
                loginInvalidPassword: "Credenciales incorrectas.",
                activeOk: "La cuenta ha sido activada",
                activeNotFound: "La cuenta no existe, por favor verifique sus credenciales.",
                logoutOk: "Sesión cerrada.",
            }
        },
        reports: {
            middlewares: {
                verifySeedNotSend: "Debe mandar la semilla.",
                verifySeedNotMatch: "Este tipo de reporte no está registrado."
            },
            controllers: {
                getReportNotFound: "Reporte no encontrado, a lo mejor fue eliminado.",
                createOk: "Su reporte ha sido enviado.",
            }
        }
    }
}