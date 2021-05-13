let sumTotalDebe =0
let sumTotalHaber = 0
let listCurrencies = []
let listAccounts= []
let idDetailVoucher = 0
$(document).ready(function () {
    getMainCurrency()
    $("#txtdateVoucher").val(getCurrentDate())
});

function getCurrentDate() {
    let  d = new Date();
    let  month = d.getMonth() + 1;
    let day = d.getDate();
    let  output = d.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day;
    return output
}
function getMainCurrency() {
    let url = "/Voucher/getMainCurrency"
    solicitudAjax(url, responseMainCurrency, {}, "JSON", "POST");

}
function responseMainCurrency(response) {
    const { currency, idVoucherNext,exchange,currencies,accounts } = response
    console.log(response)
    listCurrencies = currencies
    listAccounts = accounts
    makeDropdown()
    makeDropdownAccount()
    $("#txtNextId").val(idVoucherNext)
    $("#txtExchange").val(exchange)

}
function makeDropdown() {
    let list =''
    for (let i = 0; i < listCurrencies.length; i++) {
        list += `<option value =${listCurrencies[i].idCurrency}> ${listCurrencies[i].nameCurrency}</option>`
    }
    $("#dropdownCurrency").empty().append(list)
}
function makeDropdownAccount() {
    let list =''
    for (let i = 0; i < listAccounts.length; i++) {
        list += `<option value =${listAccounts[i].idAccount}> ${listAccounts[i].codeAccount+'-'+listAccounts[i].nameAccount
    }</option >`
    }
    $("#dropdownAccount").empty().append(list)
    $("#dropdownAccount").select2()

}
function openModal(isEdit = false) {
    $("#modalVoucher").modal({ show: true, keyboard: false, backdrop: 'static' })
    if (isEdit) {
        modificarTexto('txtTitleAddVoucher','Editar Detalle de Comprobante')
        modificarTexto('btnInsertForm', 'Guardar')
    } else {
    let gloss =$("#txtgloss").val()
     $("#txtgloss2").val(gloss)
        modificarTexto('txtTitleAddVoucher','Nuevo Detalle de Comprobante')
        modificarTexto('btnInsertForm', 'Guardar')
    }
}
function closeModal() {
    $('#modalVoucher').modal('hide')
    resetDetailVoucher()
}
function getDataVoucher() {
    let serieVoucher = $("#txtNextId").val()
    let gloss= $("#txtgloss").val().trim()
    let tc = $("#txtExchange").val()
    let typeVoucher = $("#dropdownTypeVoucher").val()
    let  idCurrency= $("#dropdownCurrency").val()
    let dateVoucher =$("#txtdateVoucher").val()
    return {
        serieVoucher,
        gloss,
        tc,
        typeVoucher,
        idCurrency,
        dateVoucher
    }
}
function sendAll() {
    if (sumTotalDebe !== sumTotalHaber) {
        generadorAlertas('error', 'Error', 'No se puede guardar,totales no son iguales')
    } else {

    console.log(getDataVoucher())
        let data = {
            voucher: getDataVoucher(),
            listVoucherDetail: listDetailVoucher
        }
      let url = "/Voucher/sendAll"
    solicitudAjax(url, responseSendAll, data, "JSON", "POST");

    }
}
function responseSendAll(response) {
    console.log(response)
    const {Done,Message} = response.data
    if (Done) {

        generadorAlertas('success', 'Exito', 'Agregado exitosamente')
    } else {

        generadorAlertas('error', 'Error',Message)
    }
}



/*--------------------------------------------------------Modal----------------------------------*/
let listDetailVoucher = []
function getDataVoucherDetail() {
    let idVoucherDetail= 0
    let idAccount= $('#dropdownAccount').val()
    let account = $('#dropdownAccount option:selected').text().trim()
    let gloss = $("#txtgloss2").val().trim()
    let amountOwed = $("#txtDebe").val()
    let amountAssets = $('#txtHaber').val()
    let amountOwedAlt = 0
    let amountAssetsAlt= 0
    if (amountOwed === "") {
        amountOwed ="0"
    }
    if (amountAssets === "") {
        amountAssets ='0'
    }
    return {
        idVoucherDetail,
        idAccount,
        amountOwed,
        amountAssets,
        amountOwedAlt,
        amountAssetsAlt,
        gloss,
        account
    }
}


$("#txtDebe").on("keyup", function (e) {
    let { value } = e.target
    if (value !== '') {
        $("#txtHaber").attr('readonly', true);
        $("#txtHaber").val(0);
    } else {
        $("#txtHaber").attr('readonly', false);
    }
})
$("#txtHaber").on("keyup", function (e) {
    let { value } = e.target
    if (value !== '') {
        $("#txtDebe").attr('readonly', true);
        $("#txtDebe").val(0);
    } else {
        $("#txtDebe").attr('readonly', false);
    }
})


function saveVoucherDetail() {
    let data = getDataVoucherDetail()
    if (data.gloss === "") {
        generadorAlertas('error', 'Error', 'La glosa es un campo requerido')
    } else if (data.amountOwed === "0" && data.amountAssets ==="0") {
        generadorAlertas('error', 'Error', 'Debe ingresar al menos un campo(DEBE,HABER)')
    }
    else {
        if (idDetailVoucher === 0) {
            //Agregar
            sumTotalDebe += parseInt(data.amountOwed)
            sumTotalHaber += parseInt(data.amountAssets)
            $("#txtDebeTotal").text(sumTotalDebe)
            $("#txtHaberTotal").text(sumTotalHaber)
            data.idVoucherDetail = uuidv4()
            listDetailVoucher.push(data)
            $("#txtgloss").val(data.gloss)
            tableDetailVoucher()
            closeModal()
            generadorAlertas('success', 'Exito', 'Agregado exitosamente')
        } else {
            //Editar
            let index = listDetailVoucher.findIndex(item => item.idVoucherDetail === idDetailVoucher)
            listDetailVoucher[index].gloss = data.gloss
            listDetailVoucher[index].idAccount = data.idAccount
            listDetailVoucher[index].amountAssets = data.amountAssets
            listDetailVoucher[index].amountOwed = data.amountOwed

            sumTotalDebe += parseInt(data.amountOwed)
            sumTotalHaber += parseInt(data.amountAssets)
            $("#txtDebeTotal").text(sumTotalDebe)
            $("#txtHaberTotal").text(sumTotalHaber)

            $("#txtgloss").val(data.gloss)
            closeModal()
            tableDetailVoucher()
            generadorAlertas('success', 'Exito', 'Editado exitosamente')
        }

    }
}
function tableDetailVoucher() {
    $("#tblDetailVoucher").DataTable({
        "data": listDetailVoucher,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "pageLength": 5,
        //"scroller": true,
        columnDefs: [
            //{ responsivePriority: 1, targets: 0 },
            //{ responsivePriority: 1, targets: -1 },
            {targets:3, className: 'dt-body-right'},
            {targets:2, className: 'dt-body-right'},
        ],
        "columns": [
            { "data": "account", "autoWidth": true },
            { "data": "gloss", "autoWidth": true },
            { "data": "amountOwed", "autoWidth": true },
            { "data": "amountAssets", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    let id = set.idVoucherDetail
                    return `
                        <div class="text-center">
                        <button class="btn btn-sm btn-info" onClick="editDetailVoucher('${id}')" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button class="btn btn-sm btn-danger" onClick="deleteDetailVoucher('${id}')" data-toggle="tooltip" data-placement="top" title="Eliminar Empresa"><span class="fas fa-trash" aria-hidden="true"></span></button>
                        </div>
                        `;
                }
            }
        ],
        "drawCallback": function () {
            $('[data-toggle="tooltip"]').tooltip();
        },
 "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }

    });
}


function deleteDetailVoucher(id) {
    let index = listDetailVoucher.findIndex(item => item.idVoucherDetail === id)
    let detailVucher = listDetailVoucher.find(item => item.idVoucherDetail === id)
  Swal.fire({
        title: 'Eliminar',
        text: "¿Esta seguro que desea eliminar el detalle de comprobante?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            listDetailVoucher.splice(index, 1)
            sumTotalDebe -= detailVucher.amountOwed
            sumTotalHaber -= detailVucher.amountAssets
            $("#txtDebeTotal").text(sumTotalDebe)
            $("#txtHaberTotal").text(sumTotalHaber)
            tableDetailVoucher()
        }
    })

}
function editDetailVoucher(id) {
    let findCompanyVoucher = listDetailVoucher.find(item => item.idVoucherDetail === id)
    console.log(findCompanyVoucher)
    idDetailVoucher = findCompanyVoucher.idVoucherDetail
    sumTotalDebe -= parseInt(findCompanyVoucher.amountOwed)
    sumTotalHaber -= parseInt(findCompanyVoucher.amountAssets)

    $('#dropdownAccount ').val(findCompanyVoucher.idAccount)
    $("#txtgloss2").val(findCompanyVoucher.gloss)
    $("#txtDebe").val(findCompanyVoucher.amountOwed)
    $('#txtHaber').val(findCompanyVoucher.amountAssets)

    openModal(true)
}
function back() {
 Swal.fire({
        title: 'Salir',
        text: "¿Esta seguro que desea salir del comprobante?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            console.log('saliendo')
        }
    })

}



function resetDetailVoucher() {
  //$('#dropdownAccount').val("")
  //$('#dropdownAccount').text("").trim()
  $("#txtgloss2").val("")
  $("#txtDebe").val("")
  $('#txtHaber').val("")
  $("#txtDebe").attr('readonly', false);
  $("#txtHaber").attr('readonly', false);
  idDetailVoucher = 0
}
