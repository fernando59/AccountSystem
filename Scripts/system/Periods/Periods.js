let listPeriod= []
let idPeriod= 0
let startDateManagement =0
let endDateManagement =0
$(document).ready(function () {
    getPeriod()

    startDateManagement = localStorage.getItem('startDate')
    endDateManagement = localStorage.getItem('endDate')
    console.log(startDateManagement)
    console.log(endDateManagement)
    modificarTexto('lblTitle', 'Adminstracion de Periodo ' + " " + startDateManagement + " - " + endDateManagement)
});

function getData() {
    let namePeriod= $('#txtNamePeriod').val()
    let startDate= $('#txtPeriodStart').val()
    let endDate = $('#txtPeriodEnd').val()
    return {
        namePeriod,
        startDate,
        endDate,
        idPeriod,
    }
}
function setData(data) {
    const { namePeriod, startDate, endDate } = data
    idPeriod= data.idPeriod
    $('#txtNamePeriod').val(namePeriod)
    $('#txtPeriodStart').val(ConvertirFecha2(startDate))
    $('#txtPeriodEnd').val(ConvertirFecha2(endDate))

}

function resetPeriod() {
    $('#txtNamePeriod').val('')
    $('#txtPeriodStart').val('')
    $('#txtPeriodEnd').val('')
    idPeriod= 0
}



function getPeriod() {
    let url = "/Period/getPeriod";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, getPeriodResponse, data, typeData, type);
}

function getPeriodResponse(response) {
    console.log(response)
    listPeriod = response.data
    tablePeriod()
}


function tablePeriod() {
    $("#tblPeriod").DataTable({
        "data": listPeriod,
        "destroy": true,
        "searching": true,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "pageLength": 8,
        "columns": [
            { "data": "namePeriod", "autoWidth": true },
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
                const id = set.idPeriod
                const state = set.state
                    return `
                        <div class="text-center">
                        <button class="btn btn-xs btn-info" onClick="editPeriod(${id},${state})"  ${state === 0 ? 'disabled' : null} data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button class="btn btn-xs btn-danger" onClick="deletePeriod(${id},${state})"  ${state === 0 ? 'disabled' : null}  data-toggle="tooltip" data-placement="top" title="Eliminar Periodo"><span class="fas fa-trash" aria-hidden="true"></span></button>
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


//-------------------------------------------------------------  CRUD

function savePeriod() {
    let Period = getData()
    let data = { Period };
    let url = "/Period/insertPeriod"
    if (idPeriod!== 0) {
        url = "/Period/updatePeriod"
    }
    if (validatePeriod(Period)) {
       solicitudAjax(url, newPeriodResponse, data, "JSON", "POST");
    }



    
}

function newPeriodResponse(response) {
    const { Message, Done } = response.data
    if (Done) {
        generadorAlertas('success', 'Exito', "Guardado Exitosamente")
        closeModalPeriod()
        getPeriod()
    } else {
        console.log('entro a backend')
        generadorAlertas('error', 'Error', Message)
    }
}


const editPeriod = (id, state) => {
    console.log(id,state)
    if (state === 0) {
        generadorAlertas('error', 'Error', "No puede editar una gestion cerrada")
    } else {
    let find = listPeriod.find(element => element.idPeriod === id)
    openModalPeriod(true)
    setData(find)
    }

}

const deletePeriod= (idPeriod,state) => {

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
            let url = "/Period/deletePeriod"
            let data = { idPeriod }
            solicitudAjax(url, responseDeletePeriod, data, "JSON", "POST")
        }
    })
    }

}
const responseDeletePeriod = (response) => {
    const { Done, Message } = response.data
    if (Done) {
        generadorAlertas('success', 'Exito', "Eliminado Exitosamente")
        getPeriod()
    } else {
        generadorAlertas('error', 'Error', "No se puede eliminar el periodo,")
    }
}
//---------------------------------------- Modals

function openModalPeriod(isEdit =false) {
    
    $("#modalPeriodSave").modal({ show: true, keyboard: false, backdrop: 'static' })
    if (isEdit) {
        modificarTexto('txtTitleCompanyModal','Editar Empresa')
        modificarTexto('btnInsertForm', 'Guardar')
    } else {
        modificarTexto('txtTitleCompanyModal','Nueva Empresa')
        modificarTexto('btnInsertForm', 'Insertar')
    }

}
function closeModalPeriod() {
    $('#modalPeriodSave').modal('hide')
    resetPeriod()
}


