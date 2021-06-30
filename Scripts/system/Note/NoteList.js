let listNote =[]


function goNote() {
   localStorage.setItem("idNote", 0)
    window.location = "https://localhost:44348/AccountingSystem/Note/Index";

}
$(document).ready(function () {
    getNote()
   localStorage.setItem("idNote", 0)
});




function getNote() {
    let url = "/Note/getNotes"
    let data={typeNote :1}
    solicitudAjax(url, responseNote, data, "JSON", "POST");
}

function responseNote(response) {
    console.log(response)
    listNote= response.data
    tableNote()
}

function tableNote() {
    $("#tblNote").DataTable({
        "data": listNote,
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

            { "data": "nroNote" },
            {
                "render": function (row, type, set) {
                    let { dateNote } = set
                    return ConvertirFecha(dateNote)
                },
            },
            { "data": "description" },
            {
                "render": function (row, type, set) {

                    if (set.typeNote === 1) {
                        return 'Compra'
                    } else {
                        return 'Venta'
                    }
                }
            },
             {
                "render": function (row, type, set) {

                    if (set.statusNote=== 1) {
                        return 'Abierto'
                    } else {
                        return 'Anulado'
                    }
                }
            },

            {
                "render": function (row, type, set) {
                    console.log(set)
                    const id = set.idNote
                    const status = set.statusVoucher
                    const idCompany = set.idCompany
                    console.log(set.statusVoucher)
                    if (status === 3) {

                        return `<div class="text-center">
                        <a class="btn  btn-primary  btn-sm"   data-toggle="tooltip" data-placement="top" title="Reporte de Comprobante" href="http://192.168.100.8/Report/report/Report%20Account/ReportNote?idNote=${id}"  target="_blank"><span class="glyphicon glyphicon-check" aria-hidden="true"><i class="fas fa-book"></i></span></a>

                        <button class="btn btn-sm btn-info" onClick="editVoucher(${id})" disabled data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-eye" aria-hidden="true"></span></button>
                        </div>

                        `
                    } else {

                        return `<div class="text-center">
                        <a class="btn  btn-primary  btn-sm"   data-toggle="tooltip" data-placement="top" title="Reporte de Comprobante" href="http://192.168.100.8/Report/report/Report%20Account/ReportNote?idNote=${id}"  target="_blank"><span class="glyphicon glyphicon-check" aria-hidden="true"><i class="fas fa-book"></i></span></a>
                        <button class="btn btn-sm btn-info" onClick="editNote(${id})" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-eye" aria-hidden="true"></span></button>
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
function editNote(id) {
    localStorage.setItem("idNote",parseInt( id))
    window.location = "https://localhost:44348/AccountingSystem/Note/Index";

}
$('#tblNote tbody').on('dblclick', 'tr', function () {
    let data = $('#tblNote').DataTable().row(this).data();
    let id =data.idNote
    console.log(data)
    localStorage.setItem("idNote", id)
    window.location = "https://localhost:44348/AccountingSystem/Note/Index";



});


