let listArticle = []
let sendAllArticles =[]
let idArticle = 0
let idNote =0
let totalNote = 0



$(document).ready(function () {
    getNote()
    getArticles()
    $("#txtDate").val(getCurrentDate())
    let id = localStorage.getItem("idNote")
    if (parseInt(id) !== 0) {
        idNote =parseInt( id)
        $("#btnPrintNote").show()
        getDataNoteEdit(idNote)
    } else {

    }
});
function getDataNoteEdit(idNote) {
    let url = "/Note/getEditDataNote"
    let data = {
        idNote: idNote
    }
    solicitudAjax(url, responseGetDataNote, data, "JSON", "POST");

}
function responseGetDataNote(responses) {
    console.log(responses)
    const { response, note, lotes } = responses.data
    if (response.Done) {
        $("#txtDescriptionNote").val(note.description)
        $("#txtNroNote").val(note.nroNote)
        $("#txtTotal").text(note.total)
        if (note.statusNote === 1) {
            $("#txtStatusNote").val('Abierto')
            $("#btnNullNote").show()
        } else if (note.statusNote === 2) {
            $("#txtStatusNote").val('Anulado')
            $("#btnNullNote").hide()
        }
        //localStorage.setItem('')
        sendAllArticles = lotes
        tableArticles()
        let url = `http://192.168.100.8/Report/report/Report%20Account/ReportNote?idNote=${idNote}`
        $("#btnPrintNote").attr("href",url)

        disableAll()
    } else {
    }
}



function getArticles() {
    let url = "/Article/getArticles"
    solicitudAjax(url, responseArticle, {}, "JSON", "POST");

}

function getNote() {
    let url = "/Note/getNote"
    let data = {
        typeNote:1
    }
    solicitudAjax(url, responseNoteId, data, "JSON", "POST");
}
function responseNoteId(response) {
    console.log(response)
    $("#txtNroNote").val(response.data)
}

function responseArticle(response) {
    console.log(response)
    listArticle = response.data
    makeDropdown()
}

function makeDropdown() {
    console.log('make')
    let list = ''
    for (let i = 0; i < listArticle.length; i++) {
        list += `<option value =${listArticle[i].idArticle}> ${listArticle[i].nameArticle}</option>`
    }

    $("#dropdownArticle").empty().append(list)
    $("#dropdownArticle").select2()

}

/**-------------------------TABLE -*------------------------------------ */

function tableArticles() {
    $("#tblArticles").DataTable({
        "data": sendAllArticles,
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
            { "data": "article", "autoWidth": true },
            { "data": "quantityLote", "autoWidth": true },
            { "data": "price", "autoWidth": true },
            { "data": "subTotal", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    let id = set.idArticle
                    if (parseInt(idNote) !== 0 ) {
                         $('button[name="bt"]').prop('disabled',true)
                    }

                        return `
                        <div class="text-center">
                        <button name="bt" class="btn btn-sm btn-info bt" onClick="editArticle('${id}')" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button name="bt" class="btn btn-sm btn-danger bt" onClick="deleteArticle('${id}')" data-toggle="tooltip" data-placement="top" title="Eliminar Lote"><span class="fas fa-trash" aria-hidden="true"></span></button>
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













/**-------------------------------MODAL ----------------------------------*/
function getData() {
    let dateNote = $("#txtDate").val()
    let description = $("#txtDescriptionNote").val().trim()
    let nroNote = parseInt( $("#txtNroNote").val())
    let total = totalNote
    return {
        dateNote,
        description,
        nroNote,
        total

    }
}

function getDataModal() {
    let article = $("#dropdownArticle option:selected").text().trim()
    let idArticle = $("#dropdownArticle").val()
    let dueDate = $("#txtDueDate").val()
    let quantityLote = $("#txtQuantity").val()
    let price = $("#txtPrice").val()
    let subTotal = $("#txtSubTotal").val()
    return {
        article,
        dueDate,
        quantityLote,
        price,
        subTotal,
        idArticle
    }
}
function setDataModal(data) {
    console.log(data)
    $("#dropdownArticle").val(data.idArticle)
    $("#dropdownArticle option:selected").text(data.article)
    $("#txtDueDate").val(data.dueDate)
    $("#txtQuantity").val(data.quantityLote)
    $("#txtPrice").val(data.price)
    $("#txtSubTotal").val(data.subTotal)
}

function resetModal() {
     $("#dropdownArticle").val()
     $("#txtDueDate").val('')
     $("#txtQuantity").val('')
     $("#txtPrice").val('')
     $("#txtSubTotal").val('0')
     idArticle = 0
}
function openModal(isEdit = false) {
    $("#modalNote").modal({ show: true, keyboard: false, backdrop: 'static' })
//    if (isEdit) {
//        modificarTexto('txtTitleAddVoucher','Editar Detalle de Comprobante')
//        modificarTexto('btnInsertForm', 'Guardar')
//    } else {
//    let gloss =$("#txtgloss").val()
//     $("#txtgloss2").val(gloss)
//        modificarTexto('txtTitleAddVoucher','Nuevo Detalle de Comprobante')
//        modificarTexto('btnInsertForm', 'Guardar')
//    }
}


function closeModal() {
    $('#modalNote').modal('hide')
    resetModal()
}

$("#txtPrice").on("keyup", function (e) {
    let { value } = e.target
    let quantityLote = $("#txtQuantity").val()
    if (quantityLote !== "" || parseInt(quantityLote) > 0) {
        $("#txtSubTotal").val(quantityLote * value)
    }
})
$("#txtQuantity").on("keyup", function (e) {
    let { value } = e.target
    let price = $("#txtPrice").val()
    if (price !== "" || parseFloat(price) > 0) {
        $("#txtSubTotal").val(price *value)
    }
})


function saveArticle() {
    console.log(getDataModal())
    let data = getDataModal()
    if (validateArticle()) {

        if (idArticle !== 0) {
            //Edit
            console.log(sendAllArticles)
            let without = sendAllArticles.filter(item => parseInt(item.idArticle) !== parseInt(idArticle))
            console.log(without)
            let filt = without.filter(item => item.article == data.article)
            console.log(filt)
            if (filt.length >= 1) {
                generadorAlertas('error', 'Error', 'Ya existe un articulo registrado')
                return
            } else {
                console.log('enter to edit')
                let index = sendAllArticles.findIndex(item => parseInt(item.idArticle) === parseInt(idArticle))
                totalNote -= parseFloat( sendAllArticles[index].price * sendAllArticles[index].quantityLote)
                sendAllArticles[index].price = data.price
                sendAllArticles[index].quantityLote = data.quantityLote
                sendAllArticles[index].subTotal = data.subTotal
                sendAllArticles[index].article = data.article
                sendAllArticles[index].idArticle = data.idArticle
                totalNote += parseFloat( data.subTotal)
                $("#txtTotal").text(totalNote)
            }
        } else {
            //Create
            let without = sendAllArticles.filter(item => item.article === data.article)
            console.log(without.length)
            if (without.length > 0) {
                generadorAlertas('error', 'Error', 'Ya existe un articulo registrado')
                return
            } else {
                totalNote += parseFloat(data.subTotal)
                $("#txtTotal").text(totalNote)
                sendAllArticles.push(data)
            }
        }
        console.log('save---------------------')
        console.log(sendAllArticles)
        tableArticles()
        closeModal()
    }

}
function validateArticle() {
    let { price, quantityLote } = getDataModal()
     if (quantityLote === '') {
        generadorAlertas('error', 'Error', 'El campo cantidad no puede estar vacio')
        return false
     }else  if (parseInt(quantityLote) <= 0) {
        generadorAlertas('error', 'Error', 'La cantidad debe ser mayor a cero')
        return false
    }
    if (price === '') {
        generadorAlertas('error', 'Error', 'El campo precio no puede estar vacio')
        return false
    } else if (parseFloat(price) <= 0) {
        generadorAlertas('error', 'Error', 'El campo precio debe ser mayor a cero')
        return false
    }
    return true
}

function saveAll() {
    console.log(getData())

}


function editArticle(id) {
    idArticle =id
    let find = sendAllArticles.find(item => parseInt(item.idArticle) === parseInt(id))
    setDataModal(find)
    openModal(true)
}

function deleteArticle(id) {
    let index = sendAllArticles.findIndex(item => item.idArticle == id)
  Swal.fire({
        title: 'Eliminar',
        text: "¿Esta seguro que desea eliminar el lote de articulos?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let find = sendAllArticles.find(item => parseInt(item.idArticle) === parseInt(id))
            sendAllArticles.splice(index, 1)
            totalNote -= find.subTotal
            $("#txtTotal").text(totalNote)
            tableArticles()
        }
    })


}


function sendAll() {

    let url = "/Note/insertBuyNote"
    if (sendAllArticles.length > 0) {

        //if (idArticle !== 0) {
        //}
        if ($("#txtDescriptionNote").val().trim() !== '') {
        let data = {
            note: getData(),
            lotes: sendAllArticles
        }
        console.log(data)
        solicitudAjax(url, responseSendAll, data, "JSON", "POST");
        } else {
        generadorAlertas('error', 'Error', 'El campo descripcion no puede estar vacio')
        }
    } else {
        generadorAlertas('error', 'Error', 'Debe insertar por lo menos un lote')
    }
}

function responseSendAll(responses) {
    console.log(responses)
    const {lotes,note,response} = responses.data 
    if (response.Done) {
        idNote = note.idNote
        sendAllArticles  = lotes
        $("#txtNroNote").val(note.nroNote)
        $("#btnNullNote").show()
        $("#btnPrintNote").show()
        $("#btnSave").prop('disabled',true)
        generadorAlertas('success', 'Exito', 'Agregado exitosamente')
        let url = `http://192.168.100.8/Report/report/Report%20Account/ReportNote?idNote=${idNote}`
        $("#btnPrintNote").attr("href",url)

    } else {

        generadorAlertas('error', 'Error',response.Message )
    }
}

function nullNote() {
  Swal.fire({
        title: 'Anular',
        text: "¿Esta seguro que desea  anular la nota?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let url = "/Note/deleteNote"
            const id = idNote
    let data = {
        idNote: id,
        lotes:sendAllArticles
            }
            disableAll()
            solicitudAjax(url, responseNullNote, data, "JSON", "POST");


        }
    })
}
function responseNullNote(response) {
    console.log(response)
    if (response.data.Done) {
        generadorAlertas('success', 'Exito', 'Anulado exitosamente')
        $("#btnNullNote").prop('disabled',true)
    } else {
        
        generadorAlertas('error', 'Error', response.data.Message)
    }
}




/*------------------------HELPERS ----------------*/
function getCurrentDate() {
    let  d = new Date();
    let  month = d.getMonth() + 1;
    let day = d.getDate();
    let  output = d.getFullYear() + '-' +
        (month < 10 ? '0' : '') + month + '-' +
        (day < 10 ? '0' : '') + day;
    return output
}
function back() {
 Swal.fire({
        title: 'Salir',
        text: "¿Esta seguro que desea salir de la nota?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            window.location = "https://localhost:44348/AccountingSystem/Note/List";
        }
    })

}
function disableAll() {

        $("#txtExchange").attr('readonly', true);
        $("#txtDescriptionNote").attr('readonly', true);
        $("#txtStatusVoucher").attr('readonly', true);
        $("#dropdownCurrency").attr('readonly', true);
        $("#dropdownTypeVoucher").attr('readonly', true);
        $("#txtdateVoucher").attr('readonly', true);
        $("#txtgloss").attr('readonly', true);
        $("#bntAddLote").prop('disabled',true)
        $("#btnSave").prop('disabled',true)
        //$("#btnNullNote").prop('disabled',true)
}



