let listArticle = []
let NotesArticleList =[]
let idArticle = 0
let nroLote = 0
let idNote =0
let totalNote = 0
let listTableLotes = []
let editor


$(document).ready(function () {
    getNote()
    getArticles()
     modificarTexto('txtTitleModal', 'Nota de Venta')
    $("#txtDate").val(getCurrentDate())
    let id = localStorage.getItem("idNote")
    if (parseInt(id) !== 0) {
        idNote =parseInt( id)
        $("#btnPrintNote").show()
        getDataNoteEdit(idNote)
    }});

function getLoteList(id) {
    console.log(id)
    console.log('change')
   let url = "/Note/getLoteList"
    let data = {
        idArticle: id
    }
    solicitudAjax(url, responseGetLoteList, data, "JSON", "POST");

}
function responseGetLoteList(response) {
    listTableLotes = response.data
    //tableLotes()
    makeDropdownLotes()
    console.log(response)
}

function getDataNoteEdit(idNote) {
    let url = "/Note/getEditDataNote"
    let data = {
        idNote: idNote
    }
    solicitudAjax(url, responseGetDataNote, data, "JSON", "POST");

}
function responseGetDataNote(responses) {
    console.log(responses)
    const { response, note, lotes,details } = responses.data
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
        if (note.typeNote == 1) {

            NotesArticleList = lotes
        } else {
            NotesArticleList = details
        }
        tableDetails()
        let url = `http://192.168.100.8/Report/report/Report%20Account/ReportNoteSale?idNote=${idNote}`
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
        typeNote:2
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
    let list = ''
    for (let i = 0; i < listArticle.length; i++) {
        list += `<option value =${listArticle[i].idArticle}> ${listArticle[i].nameArticle}</option>`
    }

    $("#dropdownArticle").empty().append(list)
    $("#dropdownArticle").select2()
    getLoteList(listArticle[0].idArticle)
    $("#txtPrice").val(listArticle[0].salePrice)
}

function makeDropdownLotes() {
    let list = ''
    for (let i = 0; i < listTableLotes.length; i++) {
        list += `<option value =${listTableLotes[i].nroLote}> ${listTableLotes[i].nroLote}-Stock : ${listTableLotes[i].stock}</option>`
    }

    $("#dropdownLote").empty().append(list)
    $("#dropdownLote").select2()
    //getLoteList(listArticle[0].idArticle)
}

/**-------------------------TABLE -*------------------------------------ */

function tableDetails() {
    $("#tblDetails").DataTable({
        "data": NotesArticleList,
        "destroy": true,
        "searching": false,
        "ordering": false,
        "bLengthChange": false,
        "bInfo": false,
        "height":300,
        "paging": false,
        "pageLength": 55,
        //"scroller": true,
        //"fixedHeader": {
        //    header: true,
        //    footer: true
        //},
        columnDefs: [
            //{ responsivePriority: 1, targets: 0 },
            //{ responsivePriority: 1, targets: -1 },
            {targets:4, className: 'dt-body-right text-right'},
            {targets:3, className: 'dt-body-right text-right'},
            {targets:1, className: 'dt-body-right'},
            {targets:0, className: 'dt-body-right'},
        ],
        "columns": [
            { "data": "article", "autoWidth": true },
            { "data": "nroLote", "autoWidth": true },
            { "data": "quantityDetail", "autoWidth": true },
            { "data": "priceSale", "autoWidth": true },
            { "data": "subTotal", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    let id = set.idArticle
                    let nroLote = set.nroLote
                    if (parseInt(idNote) !== 0 ) {
                         $('button[name="bt"]').prop('disabled',true)
                    }

                        return `
                        <div class="text-center">
                        <button name="bt" class="btn btn-sm btn-info bt" onClick="editDetail('${nroLote}','${id}')" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button name="bt" class="btn btn-sm btn-danger bt" onClick="deleteDetail('${nroLote}','${id}')" data-toggle="tooltip" data-placement="top" title="Eliminar Lote"><span class="fas fa-trash" aria-hidden="true"></span></button>
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
    let dateNote = getCurrentDate()
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
    let idArticle = $("#dropdownArticle").val()
    let article = $("#dropdownArticle option:selected").text().trim()
    let nroLote = parseInt($("#dropdownLote").val())
    let quantityDetail = parseInt($("#txtQuantity").val())
    let priceSale = parseFloat( $("#txtPrice").val())
    let subTotal = $("#txtSubTotal").val()
    return {
        idArticle,
        nroLote,
        quantityDetail,
        priceSale,
        subTotal,
        article
    }
}
function setDataModal(data) {
    console.log(data)
    $("#dropdownArticle").val(parseInt(data.idArticle))
    $("#dropdownArticle option:selected").text(data.article)
    $("#dropdownLote").val(data.nroLote)
    $("#txtQuantity").val(data.quantityDetail)
    $("#txtPrice").val(data.priceSale)
    $("#txtSubTotal").val(data.subTotal)
}

function resetModal() {
     $("#dropdownArticle").val()
     $("#txtQuantity").val('')
     //$("#txtPrice").val('')
     $("#txtSubTotal").val('0')
    idArticle = 0
    nroLote = 0
}
function openModal(isEdit = false) {
    $("#modalNote").modal({ show: true, keyboard: false, backdrop: 'static' })
}


function closeModal() {
    $('#modalNote').modal('hide')
    resetModal()
}

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
            console.log(NotesArticleList)
            let without = NotesArticleList.filter(item => parseInt(item.idArticle) !== parseInt(idArticle))
            console.log(without)
            let filt = without.filter(item => item.article == data.article)
            console.log(filt)
            if (filt.length >= 1) {
                generadorAlertas('error', 'Error', 'Ya existe un articulo registrado')
                return
            } else {
                console.log('enter to edit')

                let index = NotesArticleList.findIndex(item => parseInt(item.idArticle) === parseInt(idArticle))
                NotesArticleList[index].priceSale = data.price
                NotesArticleList[index].quantityDetail= data.quantityDetail
                NotesArticleList[index].subTotal = data.subTotal
                NotesArticleList[index].article = data.article
                NotesArticleList[index].idArticle = data.idArticle
            }
        } else {
            //Create
            let without = NotesArticleList.filter(item => item.article === data.article)
            console.log(without.length)
            if (without.length > 0) {
                generadorAlertas('error', 'Error', 'Ya existe un articulo registrado')
                return
            } else {
                totalNote += parseFloat(data.subTotal)
                $("#txtTotal").text(totalNote)
                NotesArticleList.push(data)
            }
        }
        console.log('save---------------------')
        console.log(NotesArticleList)
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


function editDetail(nroLotes,idArticles) {
    idArticle = idArticles
    nroLote = nroLotes
    let find = NotesArticleList.find(item => parseInt(item.idArticle) === parseInt(idArticles) && item.nroLote == nroLotes)
    setDataModal(find)
    openModal(true)
}

function deleteDetail(idLote, idArticle) {
    console.log(idLote,idArticle)
    let index = NotesArticleList.findIndex(item => item.nroLote == idLote && item.idArticle == idArticle)
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
            let find = NotesArticleList.find(item => parseInt(item.nroLote) === parseInt(idLote) && item.idArticle == idArticle)
            NotesArticleList.splice(index, 1)
            totalNote -= find.subTotal
            $("#txtTotal").text(totalNote)
            tableDetails()
        }
    })


}


function sendAll() {

    let url = "/Note/insertSaleNote"
    if (NotesArticleList.length > 0) {
        if ($("#txtDescriptionNote").val().trim() !== '') {
        let data = {
            note: getData(),
            details: NotesArticleList
        }
        console.log(data)
        solicitudAjax(url, responseSendAll, data, "JSON", "POST");
        } else {
        generadorAlertas('error', 'Error', 'El campo descripcion no puede estar vacio')
        }
    } else {
        generadorAlertas('error', 'Error', 'Debe insertar por lo menos un articulo')
    }
}

function responseSendAll(responses) {
    console.log(responses)
    const {lotes,note,response,details} = responses.data 
    if (response.Done) {
        idNote = note.idNote
        NotesArticleList = details
        $("#txtNroNote").val(note.nroNote)
        $("#btnNullNote").show()
        $("#btnPrintNote").show()
        $("#btnSave").prop('disabled',true)
        generadorAlertas('success', 'Exito', 'Agregado exitosamente')
       let url = `http://192.168.100.8/Report/report/Report%20Account/ReportNoteSale?idNote=${idNote}`
        $("#btnPrintNote").attr("href",url)

    } else {

        generadorAlertas('error', 'Error', 'Ha ocurrido un error')
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
        details:NotesArticleList
            }
            solicitudAjax(url, responseNullNote, data, "JSON", "POST");


        }
    })
}
function responseNullNote(response) {
    console.log(response)
    if (response.data.Done) {
        generadorAlertas('success', 'Exito', 'Anulado exitosamente')
        $("#btnNullNote").prop('disabled',true)
        disableAll()
        //tableDetails()
    } else {
        
        generadorAlertas('error', 'Error', 'Ha ocurrido un error')
    }
}

$("#dropdownArticle").change(function (e) {
    let id = e.target.value
    console.log(id)
    let article = listArticle.find(item => item.idArticle === parseInt( id))
    console.log(article)
    getLoteList(id)
    $("#txtPrice").val(article.salePrice)
});



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
            window.location = "https://localhost:44348/AccountingSystem/Note/ListSale";
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


function saveDetailNote() {
    let data = getDataModal()
    if (listTableLotes.length === 0) {
        generadorAlertas('error', 'Error', 'No existen lotes')
        return
    }

    if (idArticle !== 0 && nroLote !== 0) {
        //update
        console.log('edit')
        let without = NotesArticleList.filter(item => parseInt(item.nroLote) !== parseInt(nroLote))
        console.log(without)
        let filt = without.filter(item => item.nroLote == data.nroLote)
        if (filt.length >= 1) {
            generadorAlertas('error', 'Error', 'Ya existe un lote registrado')
            return
        } else {

            let index = NotesArticleList.findIndex(item => parseInt(item.nroLote) === parseInt(nroLote))
            totalNote -= NotesArticleList[index].quantityDetail * NotesArticleList[index].priceSale
            NotesArticleList[index].quantityDetail = data.quantityDetail
            NotesArticleList[index].priceSale = data.priceSale
            NotesArticleList[index].idArticle = data.idArticle
            NotesArticleList[index].article = data.article
            NotesArticleList[index].subTotal = data.subTotal
            totalNote += data.quantityDetail * data.priceSale
             $("#txtTotal").text(totalNote)
            closeModal()
            tableDetails()

        }

    } else {
        //insert
        console.log(idArticle)
        let findLote = listTableLotes.find(item => item.nroLote === data.nroLote && parseInt(item.idArticle) === parseInt(data.idArticle))
        if (parseInt(data.quantityDetail) === 0 || data.quantityDetail ==="") {
            generadorAlertas('error', 'Error', 'La cantidad debe ser mayor a cero')
        } else {

            let without = NotesArticleList.filter(item => parseInt(item.nroLote) === parseInt(data.nroLote) && parseInt(item.idArticle) === parseInt(data.idArticle))

            if (without.length > 0) {
                generadorAlertas('error', 'Error', 'Ya existe un lote registrado')
                return
            }
            if (findLote.stock - data.quantityDetail >= 0) {

                console.log(findLote)
                console.log(data)
                NotesArticleList.push(data)
                closeModal()
                totalNote += data.priceSale* data.quantityDetail
                $("#txtTotal").text(totalNote)
                tableDetails()
            } else {
                generadorAlertas('error', 'Error', 'La cantidad supera el stock del lote')
            }
        }

    }
}
