let listArticles =[]
let idArticle = 0
let listArticleCategories =[]
let listCategory =[1,2]
let myTree
let listLoteList =[]

$(document).ready(function () {
    getArticles()
    getCategory()
});

function getLotesList(id) {
    let url = "/Note/getLoteList";
    let type = "GET";
    let data = {idArticle:id};
    let typeData = "JSON";
    solicitudAjax(url, responseLotesList, data, typeData, type);

}
function responseLotesList(response) {
    console.log(response)
    listLoteList = response.data
    tableLotes()
}


function getArticles() {
    let url = "/Article/getArticles";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, getArticleResponse, data, typeData, type);

}


function getArticleResponse(response) {
    console.log(response)
    listArticles = response.data
    tableArticle()
}
function getCategory() {
    let url = "/Category/getCategoriesNoTree";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, responseGetCategory, data, typeData, type);

}
function responseGetCategory(response) {
    listCategory = response.data
    makeDropdownCategory()


}
function makeDropdownCategory() {
    let list = ''
    for (let i = 0; i < listCategory.length; i++) {
        list += `<option value =${listCategory[i].idCategory}> ${listCategory[i].nameCategory}</option >`
    }
    $("#dropdownCategory").empty().append(list)
    $("#dropdownCategory").select2({tags:true})

}



function tableArticle() {
    $("#tblArticles").DataTable({
        "data": listArticles,
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
            { "data": "nameArticle", "autoWidth": true },
            { "data": "description", "autoWidth": true },
            { "data": "salePrice", "autoWidth": true },
            { "data": "salePrice", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    const id = set.idArticle
                    return `
                        <div class="text-center">
                        <button class="btn btn-sm btn-primary" onClick="showLotes(${id})" data-toggle="tooltip" data-placement="top" title="Listado de Lotes"><span class="fas fa-eye" aria-hidden="true"></span></button>
                        <button class="btn btn-sm btn-info" onClick="editArticle(${id})" data-toggle="tooltip" data-placement="top" title="Realizar modificaciones"><span  class="fas fa-pencil-alt" aria-hidden="true"></span></button>
                        <button class="btn btn-sm btn-danger" onClick="deleteArticle(${id})" data-toggle="tooltip" data-placement="top" title="Eliminar Empresa"><span class="fas fa-trash" aria-hidden="true"></span></button>
                        </div>
                        `;
                }
            }
        ],
        "drawCallback": function () {
            $('[data-toggle="tooltip"]').tooltip();
        },
 //"language": {
 //           "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
 //       }

   });
}


/**---------------------------------MODAL-------------------------*/

function openModal(isEdit =false) {
    console.log('open')
    $("#modalArticle").modal({ show: true, keyboard: false, backdrop: 'static' })
}
function closeModal() {
    $('#modalArticle').modal('hide')
    reset()
}

function reset() {
    idArticle = 0
    $("#txtName").val('')
    $("#txtDescription").val('')
    $("#txtPrice").val('')
}
function getData() {
    let nameArticle = $("#txtName").val()
    let description= $("#txtDescription").val()
    let salePrice = $("#txtPrice").val()
    let categories = $("#dropdownCategory").val()
    return {
        nameArticle,
        description,
        salePrice,
        idArticle,
        categories
    }
}
function setData(data) {
    idArticle = data.idArticle
    $("#txtName").val(data.nameArticle)
    $("#txtDescription").val(data.description)
    $("#txtPrice").val(data.salePrice)
    $("#dropdownCategory").val(data.listCategoriesNumber).trigger('change');

}


function saveArticle() {
    let article = getData()
    if (validate(article)) {
        let url = "/Article/insertArticle"
        if (idArticle !== 0) {
            url = "/Article/updateArticle"
        }
        let data = {
            article,
            listArticleCategories: listArticleCategories,
            categories:$("#dropdownCategory").val()
        }
        console.log(data)
        solicitudAjax(url, newArticleResponse, data, "JSON", "POST");
    }

}

function newArticleResponse(response) {
    console.log(response)
    const { Done, Message,Value } = response.data
    if (Done) {
        generadorAlertas('success', 'Exito', Message)
        getArticles()
        closeModal()
    } else {
        generadorAlertas('error', 'Error', Message)
    }
}
function editArticle(id) {

    let find = listArticles.find(element => element.idArticle === id)
    setData(find)
    console.log(find)
    openModal(true)
}
function deleteArticle(id) {
    Swal.fire({
        title: 'Eliminar',
        text: "¿Esta seguro que desea eliminar el articulo?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let url = "/Article/deleteArticle"
            let data = { id}
            solicitudAjax(url, responseDeleteArticle, data, "JSON", "POST")
        }
    })

}
function responseDeleteArticle(response) {
    const { Done, Message,Value } =response.data
    if (Done) {
        generadorAlertas('success', 'Exito', "Eliminado exitosamente")
        getArticles()
    } else {
        generadorAlertas('error', 'Error', Message)
    }
}

function validate(data) {
    if (data.nameArticle === "") {
        generadorAlertas('error', 'Error', "El campo nombre es requerido")
        return false
    }
    return true
}
function tableLotes() {
    $("#tblLote").DataTable({
        "data": listLoteList,
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
            { "data": "nroLote", "autoWidth": true },
            {
                "render": function (row, type, set) {
                    return ConvertirFecha(set.dateEntry)
                }
            }, 
             {
                 "render": function (row, type, set) {
                     if (set.dueDate == "/Date(-62135582400000)/") {
                         return '-'
                     }
                    return ConvertirFecha(set.dueDate)
                }
            }, 
            { "data": "quantityLote", "autoWidth": true },
            { "data": "stock", "autoWidth": true },
            { "data": "statusLote", "autoWidth": true },
        ],
        "drawCallback": function () {
            $('[data-toggle="tooltip"]').tooltip();
        },
 //"language": {
 //           "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
 //       }

   });
}




function showLotes(id) {
    getLotesList(id)
    $("#modalLotes").modal({ show: true, keyboard: false, backdrop: 'static' })
    console.log('show')
}
function closeModalListLotes() {
    $('#modalLotes').modal('hide')
}
