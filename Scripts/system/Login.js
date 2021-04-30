
$("#btn-login").click(function () {

    login()
})
$('#txtPassword').on('keyup', (e) => {
    if (e.keyCode === 13) {
        login()
    }
})
function login() {
    let url = "/Login/LoginUser";
    let user = getData()
    let data = { user };
    if (validateLogin()) {
    Bloquear()

        solicitudAjax(url, LoginResponse, data, 'JSON', 'POST');
    } else {
        Desbloquear()
    }
}
function validateLogin() {
    let loginUser = getData()
    if (loginUser.userAccount == "") {
        $('#txtUser').focus()
        $('#lblUser').addClass('error')
        $('#lblPassword').removeClass('error')
        return false
    } else if (loginUser.passwordAccount == "") {
        $('#txtPassword').focus()
        $('#lblPassword').addClass('error')
        $('#lblUser').removeClass('error')
        return false
    }
        $('#lblPassword').removeClass('error')
        $('#lblUser').removeClass('error')
    return true
}
function LoginResponse(response) {
    console.log(response)
    if (response.Done) {
        Desbloquear()
        let url = "/AccountingSystem/Company/Index";
        $(location).attr('href', url);
    } else {
        Desbloquear()
        generadorAlertas("error", "Atencion!", response.message);
    }

}

function getData() {
    let userAccount = $('#txtUser').val()
    let passwordAccount = $('#txtPassword').val()
    return {
        userAccount: userAccount,
        passwordAccount: passwordAccount

    }
}

//globales
var EsProduccion = false;
var RutaLocal = '';
function solicitudAjax(solicitudUrl, onSuccess, data, tipoDato, tipo) {
    if (!EsProduccion) {
        solicitudUrl = RutaLocal + solicitudUrl;
    }
    var tipoSolicitud = tipo ? 'POST' : 'GET',
        datatype = tipoDato ? 'text' : 'json';
    $.ajax({
        type: tipoSolicitud,
        datatype: datatype,
        traditional: false,
        url: solicitudUrl,
        data: data,
        success: function (responseText) {
            if (onSuccess)
                onSuccess(responseText);
        },
        error: function (exception) {
        }
    });
}

function Bloquear() {
    $.blockUI({
    });
}

function Desbloquear() {
    $.unblockUI({});
    // setTimeout($.unblockUI, 500);
}
function generadorAlertas(tipo, titulo, mensaje) {
    Command: iziToast[tipo]({
        message: mensaje,
        title: titulo,
        position: 'bottomRight',
        theme: "light",
        balloon: true,
        animateInside: true,
        animatedInside: true,
        maxWidth: 450,
        transitionIn: 'bounceInLeft',
        transitionOut: 'fadeOut',
        transitionInMobile: 'bounceInLeft',
        transitionOutMobile: 'fadeOutDown'
    });
}


