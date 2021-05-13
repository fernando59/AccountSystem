let  listVoucher=[]

$(document).ready(function () {
getVoucher()
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
                    console.log(set.idVoucher)
                    const id = set.idVoucher
                    return `<div class="text-center">
                        <button class="btn btn-sm btn-info" onClick="editVoucher(${id})" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        </div>

                        `
                }
            }
                       ],
       //"language": {
       //     "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
       // }

    });
}
function editVoucher(id) {
    console.log(id,"edit")
}
