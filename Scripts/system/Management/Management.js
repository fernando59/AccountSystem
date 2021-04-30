let listManagement = []
let idManagement = 0
$(document).ready(function () {
    getManagement()
});

function getData() {
    let nameManagement = $('#txtNameManagement').val()
    let startDate= $('#txtManagementStart').val()
    let endDate = $('#txtManagementEnd').val()
    return {
        nameManagement,
        startDate,
        endDate,
        idManagement,
    }
}
function setData(data) {
    const { nameManagement, startDate, endDate } = data
    idManagement = data.idManagement
    $('#txtNameManagement').val(nameManagement)
    $('#txtManagementStart').val(ConvertirFecha2(startDate))
    $('#txtManagementEnd').val(ConvertirFecha2(endDate))

}

function resetManagement() {
    $('#txtNameManagement').val('')
    $('#txtManagementStart').val('')
    $('#txtManagementEnd').val('')
    idManagement= 0
}





//------------------------------------------------ Tables

function getManagement() {
    let url = "/Management/getManagements";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, getManagementResponse, data, typeData, type);
}

function getManagementResponse(response) {
    console.log(response)
    listManagement = response.data
    tableManagement()
}
function tableManagement() {
    $("#tblManagement").DataTable({
        "data": listManagement,
        "destroy": true,
        "searching": true,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "pageLength": 8,
           "columns": [
            { "data": "nameManagement", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    return ConvertirFecha(set.startDate)
                }
            },
            {
                "render": function (row, type, set) {
                    return ConvertirFecha(set.endDate)
                }
            },
             {
                "render": function (row, type, set) {
                     const stateName = set.state
                     if (stateName === 1) {
                         return  "Abierto"
                     } else {
                         return "Cerrado"
                     }
                }
            },
            { "render": function (row, type, set) {
                const id = set.idManagement
                const state = set.state
                    return `
                        <div class="text-center">
                        <button class="btn btn-xs btn-info" onClick="editManagement(${id},${state})"  ${state === 0 ? 'disabled' : null} data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button class="btn btn-xs btn-danger" onClick="deleteManagement(${id},${state})"  ${state === 0 ? 'disabled' : null}  data-toggle="tooltip" data-placement="top" title="Eliminar Empresa"><span class="fas fa-trash" aria-hidden="true"></span></button>
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



$('#tblManagement tbody').on('dblclick', 'tr', function () {
    let data = $('#tblManagement').DataTable().row(this).data();
    let url = "/Management/goToPeriod";
    solicitudAjax(url, gotoPeriodResponse, data, 'JSON', 'POST')
    localStorage.setItem('startDate', data.startDate)
    localStorage.setItem('endDate',data.endDate)


});
function gotoPeriodResponse(response) {
    if (response.data) {
        let url = "/AccountingSystem/Period/Index";
        $(location).attr('href', url);

    } else {

    console.log(response)
    }
}
//-------------------------------------------------------------  CRUD

function saveManagement() {
    let management = getData()
    let data = { management };
    let url = "/Management/insertManagement"
    if (idManagement!== 0) {
        url = "/Management/updateManagement"
    }
    if (validateManagement(management)) {
       solicitudAjax(url, newManagementResponse, data, "JSON", "POST");
    }



    
}

function newManagementResponse(response) {
    const { Message, Done } = response.data
    if (Done) {
        generadorAlertas('success', 'Exito', "Guardado Exitosamente")
        closeModalManagement()
        getManagement()
    } else {
        console.log('entro a backend')
        generadorAlertas('error', 'Error', Message)
    }
}


const editManagement = (id, state) => {
    if (state === 0) {
        generadorAlertas('error', 'Error', "No puede editar una gestion cerrada")
    } else {
    let find = listManagement.find(element => element.idManagement === id)
    openModalManagement(true)
    setData(find)
    }

}

const deleteManagement= (idManagement,state) => {

    if (state === 0) {
        generadorAlertas('error', 'Error', "No puede editar una gestion cerrada")
    } else {
  Swal.fire({
        title: 'Eliminar',
        text: "¿Esta seguro que desea eliminar la gestion?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let url = "/Management/deleteManagement"
            let data = { idManagement }
            solicitudAjax(url, responseDeleteManagement, data, "JSON", "POST")
        }
    })
    }

}
const responseDeleteManagement = (response) => {
    const { Done, Message } = response.data
    if (Done) {
        generadorAlertas('success', 'Exito', "Eliminado Exitosamente")
        getManagement()
    } else {
        generadorAlertas('error', 'Error', "No se puede eliminar la gestion,tiene periodos registrados")
    }
}
//---------------------------------------- Modals


function openModalManagement(isEdit = false) {

    let isValidManagement = listManagement.filter(item =>item.state !== 0)
    console.log(isValidManagement)
 
    if (isEdit) {
        modificarTexto('txtTitleCompanyModal','Editar Gestión')
        modificarTexto('btnInsertForm', 'Guardar')
    $("#modalManagementSave").modal({ show: true, keyboard: false, backdrop: 'static' })
    } else {
        if (isValidManagement.length >= 2) {
            generadorAlertas('error', 'Error', "No puede existir más de dos gestiones abiertas")
        } else {
        modificarTexto('txtTitleCompanyModal','Nueva Gestión')
        modificarTexto('btnInsertForm', 'Insertar')
             $("#modalManagementSave").modal({ show: true, keyboard: false, backdrop: 'static' })
        }

    }

}
function closeModalManagement() {
    $('#modalManagementSave').modal('hide')
    resetManagement()
}

