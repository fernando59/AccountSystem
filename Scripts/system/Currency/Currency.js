let listCompanyCurrency = []
let listCurrency =[]


$(document).ready(function () {
getCompanyCurrency()
getCurrency()
})
function getData() {
    let nameCurrency= $('#txtnameCurrency').val()
    let exchange = $("#txtExchange").val()
    let descriptionCurrency= $('#txtdescriptionCurrency').val()
    let abbreviationCurrency = $('#txtabbreviationCurrency').val()
    let idCurrencyAltern = $("#dropdownCurrency").val()
    let active = true
    return {
        nameCurrency,
        descriptionCurrency,
        abbreviationCurrency,
        exchange,
        idCurrencyAltern,
        active
    }
}


function openModalForm(isEdit = false) {
    $("#modalCreateCurrency").modal({ show: true, keyboard: false, backdrop: 'static' })
    if (isEdit) {
        modificarTexto('txtTitleCompanyModal','Editar Empresa')
        modificarTexto('btnInsertForm', 'Guardar')
    } else {
        modificarTexto('txtTitleCompanyModal','Nueva Empresa')
        modificarTexto('btnInsertForm', 'Guardar')
    }
}
function closeModal() {
    $('#modalCreateCurrency').modal('hide')
    //reset()
}

function saveCurrency() {
    let data = getData()
    let url = "/Currency/insertCurrency"
    solicitudAjax(url, responseCurrency, data, "JSON", "POST");
}


function responseCurrency(response) {
    console.log(response)

}


function getCurrency() {
    let url = "/Currency/getCurrencyWithOutMain"
    solicitudAjax(url, responseGetCurrency, {}, "JSON", "POST");

}

function responseGetCurrency(response) {
    console.log(response)
    listCurrency = response.data
    let values = ""
    for (let i = 0; i < listCurrency.length; i++) {
        values += `<option value="${listCurrency[i].idCurrency}">${listCurrency[i].nameCurrency}</option>`
    }
    $("#dropdownCurrency").empty().append(values)
    $("#dropdownCurrency").select2()
}


function getCompanyCurrency() {
    let url = "/CompanyCurrency/getCompanyCurrency"
    solicitudAjax(url, getCompanyCurrencyResponse, {}, "JSON", "POST");

}

function getCompanyCurrencyResponse(response) {
    console.log(response)
    $("#txtCurrencyMainTitle").val(response.currency)
    $("#txtExchange").val(response.data[0].exchange)
    listCompanyCurrency = response.data
    tableCurrency()
}

function tableCurrency() {
    $("#tblCurrency").DataTable({
        "data": listCompanyCurrency,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "pageLength": 5,
        //columnDefs: [
        //    { responsivePriority: 1, targets: 0 },
        //    { responsivePriority: 1, targets: -1 }
        //],
        "columns": [
             {
                "render": function (row, type, set) {
                    return ConvertirFecha(set.dateRegister)
                }
            },
            { "data": "main" },
            { "data": "altern"},
             {
                 "render": function (row, type, set) {
                     return set.exchange ? set.exchange : '-'           
              }
            },

            {
                "render": function (row, type, set) {
                        return set.active ? 'Activo':'No activo'           
              }
            },
             ],
       //"language": {
       //     "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
       // }

    });
}

function addCompanyCurrency() {
    let data = getData()
    let url = "/CompanyCurrency/addCompanyCurrency"
    if (validate(data.exchange)) {
           solicitudAjax(url, responseAddCompanyCurrency, data, "JSON", "POST");
    }

    

}
function validate(exchange) {
    if (exchange === "") {

    generadorAlertas('error', 'Error', 'El campo no puede estar vacio')
        return false
    } 
    if (exchange < 0) {
            generadorAlertas('error', 'Error', 'El cambio debe ser mayor a cero ')
        return false
    }
    if (listCompanyCurrency[0].exchange == exchange) {
            generadorAlertas('error', 'Error', 'No puede existir dos monedas con el mismo valor seguidas')
        return false
    }
    return true
    

}


function responseAddCompanyCurrency(response) {
    console.log(response)
    getCompanyCurrency()
        generadorAlertas('success', 'Exito', "Agregado exitosamente ")
}
