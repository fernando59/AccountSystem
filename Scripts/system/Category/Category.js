let listCategory =[]
let idCategory =0
let level =0
let parentData = {}
let parent =''
let tree
let isEdit = false




$(document).ready(function () {
    getCategory()
});

function getCategory() {
    let url = "/Category/getCategories";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, responseGetCategory, data, typeData, type);

}
function responseGetCategory(response) {
    console.log(response)
    listCategory = response.data
    createTree()
}
function createTree() {
     tree = $('#tree').tree({
         uiLibrary: 'bootstrap4',
         dataSource: listCategory,
         primaryKey: 'id',
         border: true,
       });
    tree.on('select', function (e, node, id) {
        parentData = tree.getDataById(id)
        parent = tree.getNodeById(id)
        idCategory = id
        console.log(idCategory)
        console.log(parentData)
     });

    tree.on('unselect', function (e, node, id) {
        parentData = {}
        parent = ''
        idCategory =0
    })

}







/**------------------------------Modal------------------------ */
function reset() {
    idCategory= 0
    $("#txtName").val('')
    $("#txtDescription").val('')
    $("#txtPrice").val('')
    isEdit = false
}
function getData() {
    let nameCategory= $("#txtName").val()
    let description= $("#txtDescription").val()
    let idCategoryFather = 0
    let levelCategory =1
    return {
        nameCategory,
        description,
        idCategory,
        idCategoryFather,
        levelCategory

    }
}
function setData(data) {
    idCategory= data.idCategory
    $("#txtName").val(data.nameCategory)
    $("#txtDescription").val(data.description)

}
function openModal(isEdits = false) {
    isEdit = isEdits
    if (isEdit) {
        if (parent !== '') {
            modificarTexto('lblTitle','Editar Categoria')
            $("#txtName").val(parentData.text)
            $("#txtDescription").val(parentData.description)
            $("#modalCategory").modal({ show: true, keyboard: false, backdrop: 'static' })
        } else {
            modificarTexto('lblTitle','Nueva Categoria')
            generadorAlertas('error', 'Error', "Tiene que seleccionar una cuenta")
            //isEdit = false
        }
    } else {
            modificarTexto('lblTitle','Nueva Categoria')
            $("#modalCategory").modal({ show: true, keyboard: false, backdrop: 'static' })
    }
}
function closeModal() {
    $('#modalCategory').modal('hide')
    modificarTexto('lblTitle','Nueva Categoria')
    reset()
}
function saveCategory() {
    let category = getData()
    category.idCategoryFather = parentData.idCategory
    let url = "/Category/insertCategory"

    if (validate()) {
        console.log(isEdit)
        if (isEdit) {
            //update
            url = "/Category/updateCategory"
            console.log('edit')

            solicitudAjax(url, (response) => {
                console.log(response)
                if (response.data.Done) {
                    parentData.text = category.nameCategory
                    tree.updateNode(idCategory, parentData)
                    tree.unselectAll()
                    closeModal()
                    generadorAlertas('success', 'Exito', 'Cuenta editada Exitosamente')
                } else {
                    generadorAlertas('error', 'Error', 'No se puedo editar la cuenta')
                }
            }, category,"JSON","POST")
        } else {
            //Create
            console.log('create')

            if (parent ==='') {
                //Insert First Line
                console.log('first lane')
            } else {
                //Is Children
                category.levelCategory = parentData.levelCategory+1
            }

            solicitudAjax(url, (response) => {
                console.log(response)
                console.log("creado")
                if (response.data !== null) {

                    tree.addNode({ id: response.data.idCategory, text: category.nameCategory, description: category.description, level: category.levelCategory, idCategory: response.data.idCategory, nameCategory: category.nameCategory, levelCategory: category.levelCategory, idCategoryFather: response.data.idCategoryFather }, parent)
                    generadorAlertas('success', 'Exito', 'Cuenta creada Exitosamente')
                    closeModal()
                } else {

                     generadorAlertas('error', 'Error', "Ha ocurrido un error")
                }

            }, category, "JSON", "POST");



        }
    }
}
function responseSaveCategory(response) {
    
    console.log(response)    
}
function remove() {
    if (parent !== '') {
        Swal.fire({
            title: 'Eliminar',
            text: "¿Esta seguro que desea eliminar la categoria?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let url = "/Category/deleteCategory"
                let data = { idCategory: idCategory }
                solicitudAjax(url, responseDeleteCategory, data, "JSON", "POST")
            }
        })
    } else {
            generadorAlertas('error', 'Error', "Tiene que seleccionar una categoria")

    }

}
function responseDeleteCategory(response) {
    console.log(response)
    const { Done, Message, Data } = response.data
    if (Done) {
            tree.removeNode(parent)
            parent = ''
            generadorAlertas('success', 'Exito', "Eliminado Exitosamente")
    } else {
            generadorAlertas('error', 'Error', "No puede eliminar la categoria,ya tiene sub-categorias registradas")
    }
}

function validate() {
    return true
}
function colapsar() {
    tree.collapseAll()
}

function expandir() {
    tree.expandAll()
}


