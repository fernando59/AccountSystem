﻿let sumTotalDebe =0
let sumTotalHaber = 0
let sumTotalDebeAlt =0
let sumTotalHaberAlt =0
let listCurrencies = []
let listAccounts= []
let listDetailVoucher = []
let listDetailVoucherSend = []
let idDetailVoucher = 0
let idVoucher = 0
let statusVoucher = 0
let currencyMain ="Bolivianos"
$(document).ready(function () {

    $("[name='bt']").prop('disabled',true)
    let id = localStorage.getItem("idVoucher")
    if (parseInt(id) !== 0) {
        console.log(id)
        idVoucher = id
        getDataVoucherEdit(id)
        $("#btnPrintReport").show()
        $("#btnNullVoucher").show()
    } else {
    $("#txtdateVoucher").val(getCurrentDate())
    }
    getMainCurrency()
});

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
        if (voucher.statusVoucher === 3) {
            disableAll()
        }
        voucherDetail.map(item => {
            sumTotalDebe += item.amountOwed
            sumTotalHaber += item.amountAssets
        })
        $("#txtDebeTotal").text(sumTotalDebe)
        $("#txtHaberTotal").text(sumTotalHaber)

        $("#txtgloss").val(voucher.gloss)
        $('#txtNextId').val(voucher.serieVoucher)
        $("#txtExchange").val(voucher.tc)
        $("#dropdownTypeVoucher").val(voucher.typeVoucher)
        $("#txtdateVoucher").val(ConvertirFecha2(voucher.dateVoucher))

        //Loading status
        let status = JSON.parse(localStorage.getItem("voucher")).statusVoucher
        statusVoucher = status

        if (voucher.statusVoucher == 1) {
            $("#txtStatusVoucher").val('Abierto')
        } else if (voucher.statusVoucher == 2) {
            $("#txtStatusVoucher").val('Cerrado')
        } else {

            $("#txtStatusVoucher").val('Anulado')
        }
         let url = `http://192.168.100.8/Report/report/Report%20Account/ReportVoucher?idVoucher=${voucher.idVoucher}&idCompany=${voucher.idCompany}`
        $("#btnPrintReport").attr("href",url)

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
            let tc = $("#txtExchange").val()
            let account = $("#dropdownCurrency option:selected").text().trim()
            listDetailVoucher.map(item => {
                console.log(item)
                let amountOwed = item.amountOwed
                let amountAssets = item.amountAssets
                item.amountOwed = parseFloat(convertAmountOwedCurrencySave(amountOwed, tc, account))
                item.amountOwedAlt = parseFloat( convertAmountOwedAltCurrencySave(amountOwed, tc, account))
                item.amountAssets = parseFloat(convertAmountAssetsCurrencySave(amountAssets, tc, account))
                item.amountAssetsAlt =parseFloat(convertAmountAssetsAltCurrencySave(amountAssets, tc, account))

            })
            console.log(listDetailVoucher)
            let url = "/Voucher/sendAll"
            if (parseInt(idVoucher) !== 0) {
             data.voucher.idVoucher = idVoucher
            }
             solicitudAjax(url, responseSendAll, data, "JSON", "POST");
        }

    }
}
function responseSendAll(response) {
    const {Done,Message} = response.data.response
        console.log(response)
    if (Done) {

        generadorAlertas('success', 'Exito', Message)
         idVoucher = response.data.voucher.idVoucher
        let voucher = response.data.voucher
        let idCompany = response.data.voucher.idCompany
        localStorage.setItem("voucher", JSON.stringify(voucher))
        localStorage.setItem("idVoucher", voucher.idVoucher)
        localStorage.setItem("listDetailVoucher", JSON.stringify(listDetailVoucher))
        $("#btnPrintReport").show()
        $("#btnNullVoucher").show()
        let url = `http://192.168.100.8/Report/report/Report%20Account/ReportVoucher?idVoucher=${idVoucher}&idCompany=${idCompany}`
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
    let idUser = 1
    let amountAssetsAlt = 0
    //currencyMain = $("#dropdownCurrency option:selected").text()
    amountOwedAlt = amountOwed
    amountAssetsAlt = amountAssets
    //if (amountOwed != 0) {
    //    if (currencyMain == "Bolivianos") {
    //        amountOwedAlt = amountOwed / tc
    //    } else {
    //        amountOwedAlt = amountOwed*tc
    //    }
    //}
    //if (amountAssets != 0) {
    //    if (currencyMain == "Bolivianos") {
    //        amountAssetsAlt = amountAssets/tc
    //    } else {
    //        amountAssetsAlt = amountAssets * tc
    //    }
    //}
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
        account,
        idUser
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
    if (data.gloss === "") {
        generadorAlertas('error', 'Error', 'La glosa es un campo requerido')
    } else if (data.amountOwed === "0" && data.amountAssets ==="0") {
        generadorAlertas('error', 'Error', 'Debe ingresar al menos un campo(DEBE,HABER)')
    }else if (!$("#dropdownAccount").val()) {
        generadorAlertas('error', 'Error', 'Tiene que seleccionar una cuenta')
    }
     else {
              if (idDetailVoucher === 0) {
            //Agregar
                  if (filterAccount.length > 0) {
                      generadorAlertas('error', 'Error', 'Ya existe una cuenta en el detalle')

                  } else {


            sumTotalDebe += parseInt(data.amountOwed)
            sumTotalHaber += parseInt(data.amountAssets)
            $("#txtDebeTotal").text(sumTotalDebe)
            $("#txtHaberTotal").text(sumTotalHaber)
            data.idVoucherDetail = uuidv4()
            data.stateAddorUpdate = 1
            listDetailVoucher.push(data)
            listDetailVoucherSend.push(data)
            $("#txtgloss").val(data.gloss)
            tableDetailVoucher()
            closeModal()
            generadorAlertas('success', 'Exito', 'Agregado exitosamente')
                  }
        } else {
            //Editar
                  console.log(listDetailVoucher)
                  console.log(data.account)
                  let without = listDetailVoucher.filter(item => item.account.toString().trim() === data.account.toString().trim())
            console.log(without.length)
            if (without.length > 1) {
                generadorAlertas('error', 'Error', 'Ya existe una cuenta registrada')
                return
            } else {
                let index = listDetailVoucher.findIndex(item => item.idVoucherDetail === idDetailVoucher)
                 listDetailVoucher[index].gloss = data.gloss
                 listDetailVoucher[index].idAccount = data.idAccount
                 listDetailVoucher[index].amountAssets = data.amountAssets
                listDetailVoucher[index].amountOwed = data.amountOwed
                listDetailVoucher[index].account = data.account
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
}
function tableDetailVoucher() {
    $("#tblDetailVoucher").DataTable({
        "data": listDetailVoucher,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "paging": false,
        "pageLength": 55,
        //"scroller": true,
        columnDefs: [
            //{ responsivePriority: 1, targets: 0 },
            //{ responsivePriority: 1, targets: -1 },
            {targets:3, className: 'dt-body-right text-right'},
            {targets:2, className: 'dt-body-right text-right'},
            {targets:1, className: 'dt-body-right'},
            {targets:0, className: 'dt-body-right'},
        ],
        "columns": [
            { "data": "account", "autoWidth": true },
            { "data": "gloss", "autoWidth": true },
            { "data": "amountOwed", "autoWidth": true },
            { "data": "amountAssets", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    let ids = set.idVoucherDetail
                    if (parseInt(idVoucher) !== 0 && parseInt(set.statusVoucher) === 3) {
                         $('button[name="bt"]').prop('disabled',true)
                    }
                    return `
                        <div class="text-center">
                        <button name="bt" class="btn btn-sm btn-info" onClick="editDetailVoucher('${ids}')" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button name="bt" class="btn btn-sm btn-danger" onClick="deleteDetailVoucher('${ids}')" data-toggle="tooltip" data-placement="top" title="Eliminar Empresa"><span class="fas fa-trash" aria-hidden="true"></span></button>
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
    let index = listDetailVoucher.findIndex(item => item.idVoucherDetail == id)
    let detailVucher = listDetailVoucher.find(item => item.idVoucherDetail == id)
    console.log(listDetailVoucher)
    console.log(id,detailVucher)
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
    console.log(id)
    let findCompanyVoucher = listDetailVoucher.find(item => item.idVoucherDetail == id)
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

function nullVoucher() {
  Swal.fire({
        title: 'Anular',
        text: "¿Esta seguro que desea  anular el comprobante?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let url = "/Voucher/deleteVoucher"
            const id = idVoucher
    let data = {
        idVoucher:id
            }
            solicitudAjax(url, responseNullVoucher, data, "JSON", "POST");


        }
    })
}

function responseNullVoucher(response) {
    if (response.data.Done) {
        listDetailVoucher.map(item => {
            item.statusVoucher =3
        })
        console.log(listDetailVoucher)
        tableDetailVoucher()
        disableAll()
    }
}
function disableAll() {

        $("#txtExchange").attr('readonly', true);
        $("#txtDateVoucher").attr('readonly', true);
        $("#txtStatusVoucher").attr('readonly', true);
        $("#dropdownCurrency").attr('readonly', true);
        $("#dropdownTypeVoucher").attr('readonly', true);
        $("#txtdateVoucher").attr('readonly', true);
        $("#txtgloss").attr('readonly', true);
        $("#bntAddDetailVoucher").prop('disabled',true)
        $("#btnSave").prop('disabled',true)
        $("#btnNullVoucher").prop('disabled',true)
}



function convertAmountOwedCurrencySave(amountOwed, tc, account) {
    console.log(amountOwed, account, currencyMain)
    let currencyAlt = listCurrencies.filter(item => item.nameCurrency.toString().trim() !== currencyMain.toString().trim())
    if (currencyMain.toString().trim() == "Bolivianos" && account.toString().trim() == "Dolares") {
        console.log('entro aca')
        return amountOwed / tc
    } else if (currencyMain.toString().trim() == "Bolivianos" && account.trim() == "Euros") {
        console.log('entro aca 2')
        return amountOwed / tc
    } else if (currencyMain.toString().trim() == "Bolivianos" && account.trim() == "Bolivianos") {
        console.log('entro aca 3')
        return amountOwed
    } else {
        return amountOwed
    }
}
function convertAmountOwedAltCurrencySave(amountOwedAlt, tc, account) {
    if (currencyMain.toString().trim() == "Bolivianos" && account.toString().trim() == "Dolares") {
        console.log('entro aca')
        return amountOwedAlt
    } else if (currencyMain.toString().trim() == "Bolivianos" && account.trim() == "Euros") {
        console.log('entro aca2')
        return amountOwedAlt * tc
    } else if (currencyMain.toString().trim() == "Bolivianos" && account.trim() == "Bolivianos") {
        console.log('entro aca2')
        return amountOwedAlt *tc
    } else {
        console.log('no entro aca2')
        return amountOwedAlt
    }
}

function convertAmountAssetsCurrencySave(amountAssetsAlt, tc, account) {
    if (currencyMain.toString().trim() == "Bolivianos" && account.toString().trim() == "Dolares") {
        return amountAssetsAlt / tc
    } else if (currencyMain == "Bolivianos" && account == "Euros") {
        return amountAssetsAlt / tc
    }
    else if (currencyMain.toString().trim() == "Bolivianos" && account.trim() == "Bolivianos") {
        return amountAssetsAlt 
    }
    if (currencyMain == "Dolares" && account == "Bolivianos") {
        return amountAssetsAlt / tc
    } else if (currencyMain == "Euros" && account == "Euros") {
        return amountAssetsAlt / tc
    }
}
function convertAmountAssetsAltCurrencySave(amountAssetsAlt, tc, account) {
    if (currencyMain.toString().trim() == "Bolivianos" && account.toString().trim() == "Dolares") {
        return amountAssetsAlt
    } else if (currencyMain == "Bolivianos" && account == "Euros") {
        return amountAssetsAlt * tc
    }
    else if (currencyMain.toString().trim() == "Bolivianos" && account.trim() == "Bolivianos") {
        return amountAssetsAlt *tc
    }
    if (currencyMain == "Dolares" && account == "Bolivianos") {
        return amountAssetsAlt / tc
    } else if (currencyMain == "Euros" && account == "Euros") {
        return amountAssetsAlt * tc
    }
}



