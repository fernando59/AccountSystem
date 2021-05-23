let sumTotalDebe =0
let sumTotalHaber = 0
let sumTotalDebeAlt =0
let sumTotalHaberAlt =0
let listCurrencies = []
let listAccounts= []
let listDetailVoucher = []
let idDetailVoucher = 0
let idVoucher = 0
let currencyMain ="Bolivianos"
$(document).ready(function () {

    let id = localStorage.getItem("idVoucher")
    if (parseInt(id) !== 0) {
        console.log(id)
        idVoucher = id
        getDataVoucherEdit(id)
        $("#btnPrintReport").show()
    } else {
        console.log('create')
    $("#txtdateVoucher").val(getCurrentDate())
    }
    getMainCurrency()
    //init()
});

async function init() {
    let id = localStorage.getItem("idVoucher")
    if (parseInt(id) !== 0) {
        idVoucher = id
        console.log('edit')
        console.log(id)
    }
     else {
        console.log('create')
    }

}
function getDataVoucherEdit(idVoucher) {
    let url = "/Voucher/getEditDataVoucher"
    let data = {
        idVoucher : idVoucher
    }
    solicitudAjax(url, responseGetDataVoucher, data, "JSON", "POST");

}
function responseGetDataVoucher(responses) {
    console.log(responses)
    const { response,voucher,voucherDetail} = responses.data
    if (response.Done) {
        localStorage.setItem("voucher", JSON.stringify(voucher))
        localStorage.setItem("idVoucher", voucher.idVoucher)
        localStorage.setItem("listDetailVoucher", JSON.stringify(voucherDetail))

        $("#txtgloss").val(voucher.gloss)
        $('#txtNextId').val(voucher.serieVoucher)
        $("#txtExchange").val(voucher.tc)
        $("#dropdownTypeVoucher").val(voucher.typeVoucher)
        $("#txtdateVoucher").val(ConvertirFecha2(voucher.dateVoucher))

        if (voucher.statusVoucher == 1) {
            $("#txtStatusVoucher").val('Abierto')
        } else if (voucher.statusVoucher == 2) {
            $("#txtStatusVoucher").val('Cerrado')
        } else {

            $("#txtStatusVoucher").val('Anulado')
        }
        listDetailVoucher = voucherDetail
        tableDetailVoucher()
    } else {
        console.log('error')
    }
}
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
    let { currency, idVoucherNext,exchange,currencies,accounts } = response
    console.log(response)
    
    currencyMain = currency
    listCurrencies = currencies
    listAccounts = accounts
    makeDropdown()
    makeDropdownAccount()
    if (idVoucher == 0) {

    $("#txtNextId").val(idVoucherNext)
    $("#txtExchange").val(exchange)
    }

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
    let dateVoucher = $("#txtdateVoucher").val()
    let idVoucher = 0
    return {
        serieVoucher,
        gloss,
        tc,
        typeVoucher,
        idCurrency,
        dateVoucher,
        idVoucher
    }
}
function sendAll() {
    if (sumTotalDebe !== sumTotalHaber) {
        generadorAlertas('error', 'Error', 'No se puede guardar,totales no son iguales')
    } else {

        //console.log(getDataVoucher())
        if (listDetailVoucher.length === 0) {
        generadorAlertas('error', 'Error', 'Debe ingresar al menos un detalle')
        } else {

             let data = {
                 voucher: getDataVoucher(),
                  listVoucherDetail: listDetailVoucher
             }
            let url = "/Voucher/sendAll"
            if (parseInt(idVoucher) !== 0) {
             data.voucher.idVoucher = idVoucher
            }
            console.log(data)
             solicitudAjax(url, responseSendAll, data, "JSON", "POST");
        }

    }
}
function responseSendAll(response) {
    console.log(response)
    const {Done,Message} = response.data.response
    if (Done) {

        generadorAlertas('success', 'Exito', Message)
         idVoucher = response.data.voucher.idVoucher
        let voucher = response.data.voucher
        localStorage.setItem("voucher", JSON.stringify(voucher))
        localStorage.setItem("idVoucher", voucher.idVoucher)
        localStorage.setItem("listDetailVoucher", JSON.stringify(listDetailVoucher))
        $("#btnPrintReport").show()
        let url = `http://192.168.100.8/Report/report/Report%20Account/ReportVoucher?idVoucher=${idVoucher}`
        $("#btnPrintReport").attr("href",url)
    } else {
        generadorAlertas('error', 'Error',Message)
    }
}



/*--------------------------------------------------------Modal----------------------------------*/
function getDataVoucherDetail() {
    let idVoucherDetail= 0
    let idAccount= $('#dropdownAccount').val()
    let tc = $("#txtExchange").val()
    let account = $('#dropdownAccount option:selected').text().trim()
    let gloss = $("#txtgloss2").val().trim()
    let amountOwed = $("#txtDebe").val()
    let amountAssets = $('#txtHaber').val()
    let amountOwedAlt =0
    let amountAssetsAlt = 0
    currencyMain = $("#dropdownCurrency option:selected").text()
        console.log(currencyMain)
    if (amountOwed != 0) {
        if (currencyMain == "Bolivianos") {
            amountOwedAlt = amountOwed / tc
        } else {
            amountOwedAlt = amountOwed*tc
        }
    }
    if (amountAssets != 0) {
        if (currencyMain == "Bolivianos") {
            amountAssetsAlt = amountAssets/tc
        } else {
            amountAssetsAlt = amountAssets * tc
        }
    }
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
    let filterAccount = listDetailVoucher.filter(item => item.idAccount == data.idAccount)
    console.log(filterAccount)
    if (data.gloss === "") {
        generadorAlertas('error', 'Error', 'La glosa es un campo requerido')
    } else if (data.amountOwed === "0" && data.amountAssets ==="0") {
        generadorAlertas('error', 'Error', 'Debe ingresar al menos un campo(DEBE,HABER)')
    } else if (filterAccount.length >0) {

        generadorAlertas('error', 'Error', 'Ya existe una cuenta en el detalle')
    } else if (!$("#dropdownAccount").val()) {

        generadorAlertas('error', 'Error', 'Tiene que seleccionar una cuenta')
    }
    else {
        if (idDetailVoucher === 0) {
            //Agregar
            sumTotalDebe += parseInt(data.amountOwed)
            sumTotalHaber += parseInt(data.amountAssets)
            $("#txtDebeTotal").text(sumTotalDebe)
            $("#txtHaberTotal").text(sumTotalHaber)
            data.idVoucherDetail = uuidv4()
            data.stateAddorUpdate = 1
            listDetailVoucher.push(data)
            $("#txtgloss").val(data.gloss)
            tableDetailVoucher()
            closeModal()
            console.log(listDetailVoucher)
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
            window.location = "https://localhost:44348/AccountingSystem/Voucher/List";
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
