let listCompany = []
let idCompany = 0
let listCurrency =[]

$(document).ready(function () {
    getCompanies()
    getCurrency()
});

function openModalForm(isEdit = false) {
    $("#modalCompanyCreate").modal({ show: true, keyboard: false, backdrop: 'static' })
    if (isEdit) {
        modificarTexto('txtTitleCompanyModal','Editar Empresa')
        modificarTexto('btnInsertForm', 'Guardar')
    } else {
        modificarTexto('txtTitleCompanyModal','Nueva Empresa')
        modificarTexto('btnInsertForm', 'Guardar')
    }
}

function closeModal() {
    $('#modalCompanyCreate').modal('hide')
    reset()
}
function closeModalIngresar() {
    $('#modalCompanyEnter').modal('hide')
}


function getData() {
    let nameCompany = $('#txtNameCompany').val()
    let nit = $('#txtNitCompany').val()
    let sigla = $('#txtSiglaCompany').val()
    let cellphone = $('#txtCellphoneCompany').val()
    let email = $('#txtEmailCompany').val()
    let addressCompany = $('#txtAddressCompany').val()
    let levels = $('#dropdownLevel').val()
    let idCurrency = $("#dropdownCurrency").val()
    let idUser = 1

    return {
        idCompany,
        nameCompany,
        nit,
        sigla,
        cellphone,
        email,
        addressCompany,
        levels,
        idUser,
        idCurrency

    }
}
function setData(data) {
    idCompany = data.idCompany
   $('#txtNameCompany').val(data.nameCompany)
   $('#txtNitCompany').val(data.nit)
   $('#txtSiglaCompany').val(data.sigla)
   $('#txtCellphoneCompany').val(data.cellphone)
   $('#txtEmailCompany').val(data.email)
    $('#txtAddressCompany').val(data.addressCompany)
    $('#dropdownLevel').val(data.levels)
}
function reset() {

    $('#txtNameCompany').val('')
    $('#txtNitCompany').val('')
    $('#txtSiglaCompany').val('')
    $('#txtCellphoneCompany').val('')
    $('#txtEmailCompany').val('')
    $('#txtAddressCompany').val('')
    $('#dropdownLevel').val(3)
    idCompany = 0
}



function saveCompany() {
    let company = getData()
    if (validate()) {
        let data = {company};
        let url = "/Company/insertCompany"
        if (idCompany !== 0) {
            url = "/Company/updateCompany"
        }
        solicitudAjax(url, newCompanyResponse, data, "JSON", "POST");
    }
}

//                 ----- Get Currency
function getCurrency() {
    let url = "/Currency/getCurrency";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, getCurrencyResponse, data, typeData, type);
}
function getCurrencyResponse(response) {
    listCurrency = response.data
    fillDropdownCurrency()
}

function fillDropdownCurrency() {
    let values = ""
    for (let i = 0; i < listCurrency.length; i++) {
        values += `<option value=${listCurrency[i].idCurrency}>${listCurrency[i].nameCurrency} </option>`
    }
    $("#dropdownCurrency").empty().append(values)
}


function getCompanies() {
    let url = "/Company/getCompanies";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, getCompanyResponse, data, typeData, type);
}
function getCompanyResponse(response) {
    listCompany = response.data
    tableCompany()
}
function tableCompany() {
    $("#tblCompany").DataTable({
        "data": listCompany,
        "destroy": true,
        "searching": true,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "pageLength": 5,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 1, targets: -1 }
        ],
        "columns": [
            { "data": "nameCompany", "autoWidth": true },
            { "data": "nit", "autoWidth": true },
            { "data": "sigla", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    const id = set.idCompany
                    return `
                        <div class="text-center">
                        <button class="btn btn-sm btn-info" onClick="editModalCompany(${id})" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button class="btn btn-sm btn-danger" onClick="deleteCompany(${id})" data-toggle="tooltip" data-placement="top" title="Eliminar Empresa"><span class="fas fa-trash" aria-hidden="true"></span></button>
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

function newCompanyResponse(response) {
    console.log(response)
    const { Done, Message, Value, idCompany } = response.data
    if (idCompany !== null && Value !== -1) {
      let url = "/AccountingSystem/Home/Index";
       $(location).attr('href', url);
    }
    if (Done) {
        if (Value === -1) {

            generadorAlertas('success', 'Exito', Message)
            getCompanies()
            closeModal()
        } else {
            let url = "/Management/Index";
            solicitudAjax(url, gotoManagementResponse, getData(), 'JSON', 'POST')
        }

    } else {
        generadorAlertas('error', 'Error', Message)
    }
}


$('#tblCompany tbody').on('dblclick', 'tr', function () {
    let data = $('#tblCompany').DataTable().row(this).data();

    let url = "/Company/goToManagement";
    localStorage.setItem('level', data.levels)
    console.log(data)
    solicitudAjax(url,gotoManagementResponse,data,'JSON','POST')


});
function gotoManagementResponse(response) {
    console.log(response)
    if (response.data) {
        let url = "/AccountingSystem/Home/Index";
        $(location).attr('href', url);

    } else {

    console.log(response)
    }
}

function editModalCompany(id) {
    let find = listCompany.find(element => element.idCompany === id)
    openModalForm(true)
    setData(find)
}


function deleteCompany(idCompany) {
    Swal.fire({
        title: 'Eliminar',
        text: "¿Esta seguro que desea eliminar la empresa?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let url = "/Company/deleteCompany"
            let data = { idCompany }
            solicitudAjax(url, responseDeleteCompany, data, "JSON", "POST")
        }
    })
}
function responseDeleteCompany(response) {
    const { Done, Message } = response.data
    if (Done) {
        generadorAlertas('success', 'Exito', Message)
        getCompanies()
    } else {
        generadorAlertas('error', 'Error', "No se puede eliminar la empresa,tiene gestiones registradas ")
    }
}
function validate() {
    const company = getData()
    if (company.nameCompany === '') {

    generadorAlertas('error', 'Error', 'El campo nombre no puede estar vacio')
        return false
    }
    if (company.nit === '') {

    generadorAlertas('error', 'Error', 'El campo nit no puede estar vacio')
        return false
    }
    if (company.sigla=== '') {

    generadorAlertas('error', 'Error', 'El campo sigla no puede estar vacio')
        return false
    }
    if (company.nameCompany.length > 40) {

    generadorAlertas('Error', 'Longitud', 'Longitud máxima del campo nombre es de 40 caracteres')
     
        return false
    } else if (company.sigla.length > 20) {

    generadorAlertas('error', 'Error', 'Longitud máxima del campo sigla es de 20 caracteres')

        return false
    } else if (company.cellphone.length > 15) {
    generadorAlertas('error', 'Error', 'Longitud máxima del campo telefono es de 15 caracteres')
        return false
    } else if (company.addressCompany.length > 150) {
    generadorAlertas('error', 'Error', 'Longitud máxima del campo dirección es de 150 caracteres')
        return false
    }


    if (company.email !== '') {
    if (!validateEmail(company.email)) {
    generadorAlertas('error', 'Error', 'El campo email,no tiene un formato correcto')
        return false
    }
    }
 if (!validateNombre(company.nameCompany)) {
        return false
    }

    if (!validateNit(company.nit)) {
        return false
    }
    if (!validateSigla(company.sigla)) {
        return false
    }
    return true
}

function validateNit(nit) {
    if (idCompany !== 0) {
        let find = listCompany.filter(element => element.idCompany !== idCompany)
        let compare = (element) => element.nit === parseInt(nit)
        let isFind = find.some(compare)
        if (isFind) {
             generadorAlertas('error', 'Error', 'Ya existe un nit con el mismo nombre')
            return false
        } else {
            return true
        }
    } else {
        let compare = (element) => element.nit === parseInt(nit)
        let isFind = listCompany.some(compare)
        if (isFind) {
        generadorAlertas('error', 'Error', 'Ya existe un nit con el mismo nombre')
            return false
        } else {
            return true
        }
    }

        
}
function validateSigla(sigla) {
 if (idCompany !== 0) {
     let find = listCompany.filter(element => element.idCompany !== idCompany)
     let compare = (element) => element.sigla.toUpperCase() === sigla.toUpperCase()
        let isFind = find.some(compare)
        if (isFind) {
             generadorAlertas('error', 'Error', 'Ya existe una sigla con el mismo nombre')
            return false
        } else {
            return true
        }
 } else {
     let compare = (element) => element.sigla === sigla
        let isFind = listCompany.some(compare)
        if (isFind) {
        generadorAlertas('error', 'Error', 'Ya existe una sigla con el mismo nombre')
            return false
        } else {
            return true
        }
    }

}
function validateNombre(nameCompany) {
 if (idCompany !== 0) {
     let find = listCompany.filter(element => element.idCompany !== idCompany)
     let compare = (element) => element.nameCompany.toUpperCase() === nameCompany.toUpperCase()
        let isFind = find.some(compare)
        if (isFind) {
             generadorAlertas('error', 'Error', 'Ya existe una empresa con el mismo nombre')
            return false
        } else {
            return true
        }
 } else {
     let compare = (element) => element.nameCompany === nameCompany
        let isFind = listCompany.some(compare)
        if (isFind) {
        generadorAlertas('error', 'Error', 'Ya existe una empresa con el mismo nombre')
            return false
        } else {
            return true
        }
    }


}


function report(id){
    let url = `/AccountingSystem/Company/Report`;

    window.open(url, "_blank");
}