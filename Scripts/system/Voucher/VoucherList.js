let  listVoucher=[]

$(document).ready(function () {
   getVoucher()
   localStorage.setItem("idVoucher", 0)
   localStorage.setItem("voucher", null)
});

function getVoucher() {
    let url = "/Voucher/getVoucher"
    solicitudAjax(url, responseVoucher, {}, "JSON", "POST");

}

function responseVoucher(response) {
    listVoucher = response.data
    
    console.log(response)
    tableVoucher()
}

function tableVoucher() {
    $("#tblVoucher").DataTable({
        "data": listVoucher,
        "destroy": true,
        "searching": true,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "pageLength": 5,
        columnDefs: [
           { responsivePriority: 1, targets: 1,width:"150px" },
           { responsivePriority: 0, targets: 0,width:20 },
        ],
        "columns": [

            { "data": "serieVoucher","width":"50px"},
            { "data": "gloss" },
            {
                "render": function (row, type, set) {
                    const { typeVoucher } = set
                    return typeVoucher === 1 ? 'Ingreso' : (typeVoucher === 2 ? 'Egreso' : (typeVoucher === 3 ? 'Traspaso' : (typeVoucher === 4 ? 'Apertura' : 'Ajuste')))
                },
            },

            { "data": "abbreviationCurrency" },
             {
                "render": function (row, type, set) {
                    return ConvertirFecha(set.dateVoucher)
                }
            },
            {
                "render": function (row, type, set) {
                    console.log(set)

                    const id = set.idVoucher
                    const status = set.statusVoucher
                    const idCompany = set.idCompany
                    console.log(set.statusVoucher)
                    if (status === 3) {

                        return `<div class="text-center">
                        <a class="btn  btn-primary  btn-sm"   data-toggle="tooltip" data-placement="top" title="Reporte de Comprobante" href="http://192.168.100.8/Report/report/Report%20Account/ReportVoucher?idVoucher=${id}&idCompany=${idCompany}"  target="_blank"><span class="glyphicon glyphicon-check" aria-hidden="true"><i class="fas fa-book"></i></span></a>

                        <button class="btn btn-sm btn-info" onClick="editVoucher(${id})" disabled data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        </div>

                        `
                    } else {

                        return `<div class="text-center">
                        <a class="btn  btn-primary  btn-sm"   data-toggle="tooltip" data-placement="top" title="Reporte de Comprobante" href="http://192.168.100.8/Report/report/Report%20Account/ReportVoucher?idVoucher=${id}&idCompany=${idCompany}"  target="_blank"><span class="glyphicon glyphicon-check" aria-hidden="true"><i class="fas fa-book"></i></span></a>
                        <button class="btn btn-sm btn-info" onClick="editVoucher(${id})" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        </div>

                        `
                        //<button class="btn btn-sm btn-danger" onClick="deleteVoucher(${id})"  data-toggle="tooltip" data-placement="top" title="Anular Comprobante"><span class="fas fa-trash" aria-hidden="true"></span></button>
                    }
                }
            }
                       ],
       //"language": {
       //     "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
       // }

    });
}
$('#tblVoucher tbody').on('dblclick', 'tr', function () {
    let data = $('#tblVoucher').DataTable().row(this).data();
    let id =data.idVoucher
    console.log(data)
    localStorage.setItem("idVoucher", id)
    window.location = "https://localhost:44348/AccountingSystem/Voucher/Index";



});

function deleteVoucher(id) {
  Swal.fire({
        title: 'Eliminar',
        text: "¿Esta seguro que desea eliminar el anular de comprobante?",
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
    let data = {
        idVoucher:id
    }
    solicitudAjax(url, responseDeleteVoucher, data, "JSON", "POST");


        }
    })


}
function responseDeleteVoucher(response) {
    console.log(response)
    if (response.data.Done) {

       generadorAlertas('success', 'Exito', 'Anulado Exitosamente')
    } else {
        generadorAlertas('error', 'Error', 'Ha ocurrido un error')
    }
}
function goVoucher() {

   localStorage.setItem("idVoucher", 0)
   localStorage.setItem("voucher", null)
    window.location = "https://localhost:44348/AccountingSystem/Voucher/Index";
}
function editVoucher(id) {
   localStorage.setItem("idVoucher", id)
    window.location = "https://localhost:44348/AccountingSystem/Voucher/Index";
    console.log(id,"edit")
}
