let listAccount = []
let tree
let parent = ''
let parentData = null
let level = 0
let levelParent = 0
let levelId = 0
//array por niveles 
let arrLevel1 = []
let arrLevel2 = []
let arrLevel3 = []
let arrLevel4 = []
let arrLevel5 = []
let arrLevel6 = []
let arrLevel7 = []
let compareList =[]

let text = "0."
let lastBrotherChild = ""
let countBrotherChild = 0
let arrInsert = []
let lastInserted = ""
let idInsert = 0
let idInsertedBackend = 0
let isEdit = false
$(document).ready(function () {
    getAccounts()
    level = localStorage.getItem('level')
    text = text.repeat(level)
    text = "1"+text.substring(1, text.length - 1)
    console.log(text)
});

function createText(text,levelFather,maxLevel) {

    //console.log(text)
    //console.log(levelFather)
    //console.log(maxLevel)
    //if (levelFather === 0) {
    //    let lastBrother = ''
    //    if (tree[0].childNodes[0].lastChild !== null) {
    //        lastBrother = tree[0].childNodes[0].lastChild.innerText.trim()
    //    }
    //    if (lastBrother === '') {
    //        //Es el primer elemento
    //        insertText = `1.0.0-${text}`
    //    } else {
    //        //Segundo elemento del primer nivel
    //    }
    //    console.log(lastBrother)
    //} else {
    //    console.log('es child ')
    //}
}
function openModal(editar = false) {
    if (editar) {
        isEdit = true
        if (parentData !== null) {
            modificarTexto('txtModalAccount','Editar Cuenta')
            $('#modalAccount').modal({ show: true, keyboard: false, backdrop: 'static' })
            $("#txtNameAccount").val(parentData.text.split('-')[1].trim())
        }else {

            generadorAlertas('error', 'Error', "Tiene que seleccionar una cuenta")
            isEdit = false
        }
    } else {

    if (parentData !== null) {

        levelInsert = parentData.levelAccount + 1
        if (parseInt(levelInsert) > parseInt(level)) {
            generadorAlertas('error', 'Error', "No puede crear mas niveles")
        } else {
            $('#modalAccount').modal({ show: true, keyboard: false, backdrop: 'static' })
        }
    } else {

            $('#modalAccount').modal({ show: true, keyboard: false, backdrop: 'static' })
    }

    }
}
function closeModal() {
    $('#modalAccount').modal('hide')
    modificarTexto('txtModalAccount', 'Nueva Cuenta')
    isEdit = false
    $("#txtNameAccount").val("")
}

////function add() {

////            let url = "/Account/insertAccount";
////            solicitudAjax(url, responseAdd, getData(), 'JSON', 'POST')
////}

function responseAdd(response) {
    console.log(response.data.id)
    idInsertedBackend = response.data.id
    //addPost()
}

function findNode(id, currentNode) {
    let i,
        currentChild,
        result;

    if (id === currentNode.id) {
        return currentNode;
    } else {

        // Use a for loop instead of forEach to avoid nested functions
        // Otherwise "return" will not work properly
        for (i = 0; i < currentNode.children.length; i += 1) {
            currentChild = currentNode.children[i];
            // Search in the current child
            result = findNode(id, currentChild);

            // Return the result if the node has been found
            if (result !== false) {
                return result;
            }
        }

        // The node has not been found and we have no more options
        return false;
    }
}
$("#txtNameAccount").on('keypress', function (e) {
    if (e.keyCode === 13) {
        add()
    }
})
function add() {
    let insert = $("#txtNameAccount").val()
         if (insert !== "") {
         
             if (isEdit) {
                 //let compare = compareList.filter(item => item.idAccount !== levelId)
                 //let isExist = !!compare.find(item => item.nameAccount === insert)
                 //if (isExist) {

                 //    generadorAlertas('error', 'Error', "No puede registrar cuentas con el mismo nombre")
                 //} else {

                 let url = "/Account/updateCompany";
                 let data = {
                 idAccount: levelId,
                 nameAccount: insert
                 }
                    solicitudAjax(url, async (response) => {
                 if (response.data.Done) {
                     closeModal()
                     $("#txtNameAccount").val("")
                     generadorAlertas('success', 'Exito', 'Cuenta editada exitosamente')
                     parentData.nameAccount = insert
                     let pre = parentData.text.split('-')[0]
                     parentData.text = pre+" - "+insert
                     tree.updateNode(levelId,parentData)
                 } else {

                     generadorAlertas('error', 'Error', "Ha ocurrido un error")
                 }
             }, data, 'JSON', 'POST')
                 //}

         } else {

         let levelInsert = 0
         levelParent = arrLevel1.find(i => i.id === parseFloat(levelId))
         if (levelParent + 1 === level) {
             generadorAlertas('error', 'Error', "No puede crear mas niveles")
         }
         let pre = text
         let insertText = ''
         if (parent === '') {
             //first Level
             // let compare = compareList.filter(item => item.idAccount !== levelId)
             let isExist = !!compareList.find(item => item.nameAccount === insert)
             console.log(isExist)
             if (isExist) {

                 generadorAlertas('error', 'Error', "No puede registrar cuentas con el mismo nombre")
             } else {
             let lastBrother = ''
             if (tree[0].childNodes[0].lastChild !== null) {
                 lastBrother = tree[0].childNodes[0].lastChild.innerText.trim()
             }
             if (lastBrother === '') {
                 insertText = pre + " - " + insert

             } else {
                 pre = lastBrother.split("-")[0]
                 let digit = parseInt(pre.substr(0, 1)) + 1
                 pre = digit + pre.substr(1, pre.length) + "- "  //`${parseInt(digit) + 1}.0.0 -`
                 insertText = pre + insert
             }
             levelInsert = 1
             let url = "/Account/insertAccount";
             let code = insertText.split("-")[0].trim()
             let data = {
                 codeAccount: code,
                 nameAccount: insertText.split("-")[1].trim(),
                 levelAccount: levelInsert,
                 typeAccount: 1,
                 idUser: 1,
                 idCompany: 1,
                 idAccountFather: null
             }
             solicitudAjax(url, async (response) => {
                 console.log(response)
                 if (response.data !== null) {

                     idInsertedBackend = response.data.id
                     arrLevel1.push({ text: insertText, id: idInsertedBackend, level: levelInsert, levelAccount: levelInsert })
                     tree.addNode({ text: insertText, id: idInsertedBackend, level: levelInsert, levelAccount: levelInsert }, parent);
                     arrInsert.push({ text: insertText, idAccountFather: idInsert, levelAccount: levelInsert, codeAccount: code })
                     compareList.push({ nameAccount: insert, idAccount: response.data.id })
                     closeModal()
                     $("#txtNameAccount").val("")
                     generadorAlertas('success', 'Exito', 'Cuenta creada Exitosamente')
                 } else {

                     generadorAlertas('error', 'Error', "Ha ocurrido un error")
                 }
             }, data, 'JSON', 'POST')

             }
         } else {

             //Other Level
             //tree.add({ text: insert, id: Math.random(1, 50), level: 2 }, parent)

             //levelParent = findNode(parseFloat(levelId), arrLevel1[0])
             levelInsert = parentData.levelAccount + 1
             console.log(levelInsert)
             if (parseInt(levelInsert) > parseInt(level)) {
                 generadorAlertas('error', 'Error', "No puede crear mas niveles")
             } else {
                 let typeAccount =1
                 if (parseInt(levelInsert) === parseInt(level))
                     typeAccount =2 
                 if (countBrotherChild >= 1) {
                     console.log('tiene hermanods')
                     console.log(lastInserted)
                     if (lastInserted === "") {

                         let split = lastBrotherChild.split(".")
                         console.log(lastBrotherChild)
                         console.log(split)
                         split[levelInsert - 1] = parseInt(split[levelInsert - 1]) + 1
                         let ins = split.join('.')
                         insertText = ins + " - " + insert
                         console.log('arriba ', insertText)
                     } else {
                         let split = lastInserted.split(" ")[0].split(".")
                         split[levelInsert - 1] = parseInt(split[levelInsert - 1]) + 1
                         let ins = split.join(".")
                         insertText = ins + " - " + insert
                         console.log('abajo', insertText)
                     }
                 } else {


                  //let isExist = !!compareList.find(item => item.nameAccount === insert)
                  //if (isExist) {

                  //       generadorAlertas('error', 'Error', "No puede registrar cuentas con el mismo nombre")
                  //   } else {

                  //   }


                     if (countBrotherChild === 0) {
                         countBrotherChild = 1
                     }
                     let textParent = parentData.text.split("-")[0]
                     let split = textParent.split(".")
                     split[levelInsert - 1] = parseInt(split[levelInsert - 1]) + 1
                     let ins = split.join('.')
                     insertText = ins + " - " + insert
                 }
                 console.log(insertText,"nose donde")
                    let isExist = !!compareList.find(item => item.nameAccount === insert)
                  if (isExist) {

                      generadorAlertas('error', 'Error', "No puede registrar cuentas con el mismo nombre")
                      insertText =""
                     } else {



                 let url = "/Account/insertAccount";
                 let code = insertText.split("-")[0].trim()
                 let data = {
                     codeAccount: code,
                     nameAccount: insertText.split("-")[1].trim(),
                     levelAccount: levelInsert,
                     typeAccount: typeAccount,
                     idUser: 1,
                     idCompany: 1,
                     idAccountFather: idInsert
                 }
                 solicitudAjax(url, async (response) => {

                     if (response.data !== null) {
                         idInsertedBackend = response.data.id
                         arrLevel1.push({ text: insertText, id: idInsertedBackend, level: levelInsert, levelAccount: levelInsert })
                         tree.addNode({ text: insertText, id: idInsertedBackend, level: levelInsert, levelAccount: levelInsert }, parent);
                         lastInserted = insertText
                         arrInsert.push({ id: idInsertedBackend, text: insertText, idAccountFather: idInsert, levelAccount: levelInsert, codeAccount: code })
                         compareList.push({ nameAccount: insert, idAccount: response.data.id })
                         generadorAlertas('success', 'Exito', 'Cuenta creada Exitosamente')
                         $("#txtNameAccount").val("")
                         closeModal()

                     } else {
                         generadorAlertas('error', 'Error', "Ha ocurrido un error")
                     }
                 }, data, 'JSON', 'POST')

                     }
             }
         }
     }

        //countBrotherChild = 0
     } else {
      generadorAlertas('error', 'Error', "Campo Vacio")
    }



}

function editar() {
    openModal()
}


function remove() {
        console.log(levelId)
    if (levelId !== 0) {

        Swal.fire({
            title: 'Eliminar',
            text: "¿Esta seguro que desea eliminar la cuenta?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let url = "/Account/deleteAccount"
                let data = { idAccount: levelId }
                solicitudAjax(url, responseDeleteAccount, data, "JSON", "POST")
            }
        })
    } else {
            generadorAlertas('error', 'Error', "Tiene que seleccionar una cuenta")

    }

}
function responseDeleteAccount(response) {
    console.log(response)
    if (response.data.Done) {
        tree.removeNode(parent)
        parent =""

        generadorAlertas('success', 'Exito', 'Cuenta eliminada Exitosamente')
    } else {
        generadorAlertas('error', 'Error', "No se puede eliminar la cuenta,tiene cuentas registradas ")
    }
}
function createTree() {
     tree = $('#tree').tree({
         uiLibrary: 'bootstrap4',
         dataSource: arrLevel1,
         primaryKey: 'id',
         border: true,
       });
tree.on('select', function (e, node, id) {
    parent = tree.getNodeById(id)
    parentData = tree.getDataById(id)
    levelId = id
    idInsert = parseFloat(id)
    if (parent[0].childNodes[1] !== undefined) {
        countBrotherChild = parent[0].childNodes[1].childElementCount
        if (parent[0].childNodes[1].lastChild !== undefined) {
            if (parent[0].childNodes[1].lastChild !== null) {

                let te = parent[0].childNodes[1].lastChild.innerText.trim()
                lastBrotherChild = te.split(' ')[0]
            } 
        }
    }
});
    tree.on('unselect', function (e, node, id) {
        parent = ''
        parentData = null
        lastInserted = ""
        lastBrotherChild = ""
        idInsert = 0
        levelId = 0
        countBrotherChild = 0
    })


}


function getAccounts() {
    let url = "/Account/getAccounts";
    let type = "GET";
    let data = {};
    let typeData = "JSON";
    solicitudAjax(url, getAccountResponse, data, typeData, type);
}
function getAccountResponse(response) {
    listAccount = response.data
    compareList = response.data
    console.log(response.data)
    listAccount.map(e => {
        e.children = []
        if (e.levelAccount === 1) {
            arrLevel1.push(e)
        } else if (e.levelAccount === 2) {
            arrLevel2.push(e)
        } else if (e.levelAccount === 3) {
            arrLevel3.push(e)
        } else if (e.levelAccount === 4) {
            arrLevel4.push(e)
        } else if (e.levelAccount === 5) {
            arrLevel5.push(e)
        } else if (e.levelAccount === 6) {
            arrLevel6.push(e)
        } else if (e.levelAccount === 7) {
            arrLevel7.push(e)
        }
        if (e.idAccountFather === 0) {
            //arrTest.push(e)
        }
    })
 arrLevel7.map(e => {
        
        let is = arrLevel6.findIndex(s => s.id === e.idAccountFather)
        if (is !== -1) {
        let arr = []
            arrLevel6[is].children.push(e)
        }
    })

 arrLevel6.map(e => {
        
        let is = arrLevel5.findIndex(s => s.id === e.idAccountFather)
        if (is !== -1) {
        let arr = []
            arrLevel5[is].children.push(e)
        }
    })

 arrLevel5.map(e => {
        
        let is = arrLevel4.findIndex(s => s.id === e.idAccountFather)
        if (is !== -1) {
        let arr = []
            arrLevel4[is].children.push(e)
        }
    })

 arrLevel4.map(e => {
        
        let is = arrLevel3.findIndex(s => s.id === e.idAccountFather)
        if (is !== -1) {
        let arr = []
            arrLevel3[is].children.push(e)
        }
    })

 arrLevel3.map(e => {
        
        let is = arrLevel2.findIndex(s => s.id === e.idAccountFather)
        if (is !== -1) {
        let arr = []
            arrLevel2[is].children.push(e)
        }
    })

    arrLevel2.map(e => {
        
        let is = arrLevel1.findIndex(s => s.id === e.idAccountFather)
        if (is !== -1) {
        let arr = []
            arrLevel1[is].children.push(e)
        }
    })
    createTree()
}


function colapsar() {
    tree.collapseAll()
}

function expandir() {
    tree.expandAll()
}



