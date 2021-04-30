let EsProduccion = false;
let EsServidor = false;



let RutaLocal = '/AccountingSystem';
function solicitudAjax(solicitudUrl, onSuccess, data, tipoDato, tipo) {
    if (!EsProduccion) {
        solicitudUrl = RutaLocal + solicitudUrl;
    }
    let tipoSolicitud = tipo ? 'POST' : 'GET',
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

function modificarValor(id,valor) {
    $(`#${id}`).val(valor)
}
function modificarTexto(id,valor) {
    $(`#${id}`).text(valor)
}

function redondeoDecimal(numero) {
    let flotante = parseFloat(numero);
    let resultado = Math.round(flotante * 100) / 100;
    return resultado;
}
function solicitudAjaxNoAsync(solicitudUrl, onSuccess, data, tipoDato, tipo) {
    if (!EsProduccion) {
        solicitudUrl = RutaLocal + solicitudUrl;
    }
    let tipoSolicitud = tipo ? 'POST' : 'GET',
        datatype = tipoDato ? 'text' : 'json';
    $.ajax({
        type: tipoSolicitud,
        datatype: datatype,
        traditional: false,
        async: false,
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

function sinMinusculasEspacios(valor) {
    let nuevoValor = "";
    nuevoValor = $.trim(valor);
    nuevoValor = nuevoValor.replace(/\s+/g, '').toLowerCase();
    return nuevoValor;
}
function sinEspacios(valor) {
    let nuevoValor = "";
    nuevoValor = $.trim(valor);
    nuevoValor = nuevoValor.replace(/\s+/g, '');
    return nuevoValor;
}
function sinEspaciosLeftRight(valor) {
    let nuevoValor = "";
    nuevoValor = $.trim(valor);
    return nuevoValor;
}

function solicitudAjaxArchivos(solicitudUrl, onSuccess, data, tipoDato, tipo) {
    if (!EsProduccion) {
        solicitudUrl = RutaLocal + solicitudUrl;
    }
    let tipoSolicitud = tipo ? 'POST' : 'GET',
        datatype = tipoDato ? 'text' : 'json';
    $.ajax({
        type: tipoSolicitud,
        datatype: datatype,
        contentType: false,
        processData: false,
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

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$(document).ready(function () {
     $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });

    //Responsive datatables
    $('.modal').on('shown.bs.modal', function () {
        tablaResponsive();
    });
    tablaResponsive();
});
function tablaResponsive() {
    $($.fn.dataTable.tables(true)).css('width', '100%');
    $('.dataTable').DataTable().columns.adjust().responsive.recalc();
}

function ConvertirFechaParaLista(fecha) {
    let nuevaFecha;
    if (fecha != null) {
        nuevaFecha = new Date(parseInt(fecha.substr(6)));
        nuevaFecha = nuevaFecha.toISOString().substr(0, 10);
        nuevaFecha = nuevaFecha.substring(8, 10) + "/" + nuevaFecha.substring(5, 7) + "/" + nuevaFecha.substring(0, 4);
    } else {
        nuevaFecha = "";
    }

    return nuevaFecha;
}
function ConvertirFecha2(fecha) {
    let nuevaFecha;
    if (fecha != null) {
        nuevaFecha = new Date(parseInt(fecha.substr(6)));
        nuevaFecha = nuevaFecha.toISOString().substr(0, 10);
    } else {
        nuevaFecha = "";
    }

    return nuevaFecha;
}
function ConvertirFecha(fecha) {
    let nuevaFecha;
    if (fecha != null) {
        nuevaFecha = new Date(parseInt(fecha.substr(6)));
        nuevaFecha = nuevaFecha.toISOString().substr(0, 10);
        let arregloFecha = nuevaFecha.split("-");
        let yy = arregloFecha[0];
        let mm = arregloFecha[1];
        let dd = arregloFecha[2];
        nuevaFecha = dd + "/" + mm + "/" + yy;
    } else {
        nuevaFecha = "";
    }

    return nuevaFecha;
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


function ValidarFechaInimenorqueFin(fechaInicial, fechaFinal) {
      let primera = Date.parse(fechaInicial); //01 de Octubre del 2013
    let segunda = Date.parse(fechaFinal); //03 de Octubre del 2013

    if (primera > segunda) {
        return false;
    }
    else if (primera === segunda) {
            return false
    }
    else {

        return true;
    }
}

function ControlDecimal(valor) {
    if (valor != null) {
        let resultado = valor + "";
        resultado = resultado.replace('.', ',');
        return resultado;
    } else {
        return 0;
    }
}


//Formato YYYY-MM-DD
function obtenerFechaActual() {
    return new Date().toISOString().slice(0, 10)
}
