let listAccounts = []
$(document).ready(function () {
    getAccounts()
})
function getAccounts() {
    let url = "/Configuration/getAccounts"
    solicitudAjax(url, responseAccounts, {}, "JSON", "POST");


}
function checkIfExist() {

    let url = "/Configuration/checkIfExist"
    solicitudAjax(url, responseCheckIfExist, {}, "JSON", "POST");
}
function responseCheckIfExist(responses) {
    console.log(responses)
    const { configuration, response } = responses.data
    if (response.Done) {
        $("#dropdownAccountCaja").val(configuration.idCash).change()
        $("#dropdownCreditoFiscal").val(configuration.idFiscalCredit).change()
        $("#dropdownDebitoFiscal").val(configuration.idFiscalDebit).change()
        $("#dropdownCompras").val(configuration.idPurchases).change()
        $("#dropdownVentas").val(configuration.idSales).change()
        $("#dropdownIt").val(configuration.idIt).change().change()
        $("#dropdownItPagar").val(configuration.idItToPay).change()
        $(`input[name=integration][value="${configuration.isIntegration}"]`).prop('checked',true)
        let check = $("input[name=integration]:checked").val()
        if (check ==='false') {
            disableAll()
        }

    } else {
         let check = $("input[name=integration]:checked").val()
        if (check ==='false') {
            disableAll()
        }
    }
}
async function responseAccounts(response) {
    console.log(response)
    listAccounts = response.data
    await makeDropdownAccount('dropdownAccountCaja')
    await makeDropdownAccount('dropdownCreditoFiscal')
    await makeDropdownAccount('dropdownDebitoFiscal')
    await makeDropdownAccount('dropdownCompras')
    await makeDropdownAccount('dropdownVentas')
    await makeDropdownAccount('dropdownIt')
    await makeDropdownAccount('dropdownItPagar')
    await checkIfExist()
}
function makeDropdownAccount(name) {
    let list ='<option></option>'
    for (let i = 0; i < listAccounts.length; i++) {
        list += `<option value =${listAccounts[i].idAccount}> ${listAccounts[i].codeAccount+'-'+listAccounts[i].nameAccount
    }</option >`
    }
    $(`#${name}`).empty().append(list)
    $(`#${name}`).select2({
        placeholder: "Seleccione una cuenta",
        "language": {
            "noResults": function () {
                return "No se encontro la cuenta";
            }
        }
    })

}


function saveIntegration() {
    let idCash= $("#dropdownAccountCaja").val()
    let idFiscalCredit= $("#dropdownCreditoFiscal").val()
    let idFiscalDebit= $("#dropdownDebitoFiscal").val()
    let idPurchases= $("#dropdownCompras").val()
    let idSales= $("#dropdownVentas").val()
    let idIt= $("#dropdownIt").val()
    let idItToPay= $("#dropdownItPagar").val()
    let isIntegration = $("input[name=integration]:checked").val()
    let data = {
        idCash,
        idFiscalCredit,
        idFiscalDebit,
        idPurchases,
        idSales,
        idIt,
        idItToPay,
        isIntegration
    }
    let verify = [idCash, idFiscalCredit, idFiscalDebit, idPurchases, idSales, idIt, idItToPay]
    if (verifyrepeat(verify)) {
        console.log(data)
        let url = "/Configuration/insertConfiguration"
        solicitudAjax(url, responseSaveIntegration, data, "JSON", "POST");
    }
}
function verifyrepeat(verify) {
    let unique = verify.filter(onlyUnique);
    console.log(unique)
    if (unique.length == verify.length) {
        return true
    } else {
        generadorAlertas('error', 'Error', "Existen cuentas repetidas")
        return false
    }
 }
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
$('input[type=radio][name=integration]').change(function () {
    let val = this.value
    console.log(val)
    if (val ==="false") {
        console.log('enter')
        disableAll()
    } else {
        enableAll()
    }
})

function enableAll() {
    $("#dropdownAccountCaja").attr("disabled", false)
    $("#dropdownCreditoFiscal").attr('disabled', false)
    $("#dropdownDebitoFiscal").attr('disabled',false)
     $("#dropdownCompras").attr('disabled',false)
     $("#dropdownVentas").attr('disabled',false)
     $("#dropdownIt").attr('disabled',false)
     $("#dropdownItPagar").attr('disabled',false)
}
function disableAll() {
    $("#dropdownAccountCaja").attr("disabled", true)
    $("#dropdownCreditoFiscal").attr('disabled', true)
    $("#dropdownDebitoFiscal").attr('disabled',true)
     $("#dropdownCompras").attr('disabled',true)
     $("#dropdownVentas").attr('disabled',true)
     $("#dropdownIt").attr('disabled',true)
     $("#dropdownItPagar").attr('disabled',true)

}

function responseSaveIntegration(response) {
    console.log(response)
    const {Done,Message,Value} =response.data
    if (Done) {
                generadorAlertas('success', 'Exito', Message)
    } else {
                generadorAlertas('error', 'Error', Message)
    }
}
