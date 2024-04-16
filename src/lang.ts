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
                validateRefreshToken: "No tiene acceso a este recurso.",
                getAuthUserNotFound: "Su usuario no ha sido encontrado.",
                canUsernamesNotMatch: "Hay algo mal aqui, yo también puedo romper las reglas.",
                dontCanFollow: "No puede acceder porque no tiene los privilegoios necesarios.",

                noAuth: "No está autorizado, debe iniciar sesión."
            },
            controllers: {
                register: "Se ha enviado un mail a su correo, por favor vaya a activar su usuario.",
                registerMailError: "No es posible enviar el correo de activacion, por favor intente mas tarde.",
                resendCodeNotFound: "No se encuentra registrado en el sistema, por favor registrese.",
                loginOk: "Ha iniciado sesión correctamente.",
                loginSessionUnknownDevice: "Dispositivo desconocido.",
                loginInactiveAccount: "Su cuenta no ha sido activada aun.",
                loginInvalidUsername: "Credenciales incorrectas.",
                loginInvalidPassword: "Credenciales incorrectas.",
                activeOk: "La cuenta ha sido activada.",
                activeNotFound: "La cuenta no existe, por favor verifique sus credenciales.",
                logoutOk: "Sesión cerrada.",
                forgotNotExistAccount: "Esta cuenta no se ha creado, por favor regístrese.",
                forgotOk: "Se le ha enviado un correo para cambiar la contraseña.",
                changePassword: "Contraseña cambiada.",
                refreshSidNotFound: "Al parecer a habia cerrado sesión.",
            },
            validators: {
                breakRules: "Yo también puedo romper las reglas.",
                exist: "No se ha recibido.",
                notEmpty: " no puede estar vacío.",
            }
        },
        reports: {
            middlewares: {
                isNotMine: "Este recurso no es suyo.",
            },
            controllers: {
                getReportNotFound: "Reporte no encontrado, a lo mejor fue eliminado.",
                createOk: "Su reporte ha sido enviado.",
                completeOk: "El reporte a sido completado.",
                deleteOk: "El reporte fue eliminado satisfactoriamente.",
                hasDeleted: "Al parecer el reporte ha sido eliminado anteriormente.",
                reportSolved: "El reporte ha sido solucionado.",
            },
            validators: {
                seedHasSend: "Esta semilla ya ha sido enviada."
            },
            helper: {
                getMyReportPageError: "Esta pagina no es valida." 
            }
        },
        webpush: {
            controllers: {
                deviceWasAdded: "El dispositivo fue agregado",
                deviceAdded: "El dispositivo ha sido agregado para recibir notificaciones push"
            }
        }
    },
    cors: {
        deny: "No permitido por cors."
    }
}