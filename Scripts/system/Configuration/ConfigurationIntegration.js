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
    } else {
        console.log('no exist')
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
    let list =''
    for (let i = 0; i < listAccounts.length; i++) {
        list += `<option value =${listAccounts[i].idAccount}> ${listAccounts[i].codeAccount+'-'+listAccounts[i].nameAccount
    }</option >`
    }
    $(`#${name}`).empty().append(list)
    $(`#${name}`).select2()

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
    console.log(data)
    let url = "/Configuration/insertConfiguration"
    solicitudAjax(url, responseSaveIntegration, data, "JSON", "POST");
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
