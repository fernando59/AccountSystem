
function validateManagement(management) {

    if (validateFields(management.idManagement)) {
        if (ValidarFechaInimenorqueFin(management.startDate, management.endDate)) {

            if (validateDatesCreateEnd(management.startDate, management.idManagement, management.endDate)) {
                console.log(idManagement)
                generadorAlertas('error', 'Error', 'Solapamiento de Fechas,Fecha inicio se superpone con otra')
                return false
            }
            //else if (validateDatesCreateEnd(management.endDate, management.idManagement)) {
            //    generadorAlertas('error', 'Error', 'Solapamiento de Fechas,Fecha inicio se superpone con otra')
            //    return false
            //}
            else {

                return true
            }
        } else {
            generadorAlertas('error', 'Error', 'Fecha Fin debe ser mayor a Fecha Inicio')
            return false
        }

    } else {
        return false
    } 

}

function validateDatesCreateEnd(dateStarts, id, end) {
    console.log('entrando a validacion buena')
    if (id !== 0) {
        let filter = listManagement.filter(item => item.idManagement !== id)

        let compararStart = Date.parse(dateStarts)
        let compararEnd = Date.parse(end)

       const valid = filter.map(element => {
            let dateStart = Date.parse(ConvertirFecha2(element.startDate))
            let dateEnd = Date.parse(ConvertirFecha2(element.endDate))

           console.log(dateEnd, compararStart)
            if (compararStart >= dateStart && compararStart <= dateEnd) {
                return true
                           } else if (compararEnd >= dateEnd && compararEnd <= dateEnd) {
                return true

            } else if (compararStart <= dateStart && compararEnd >= dateStart) {
                return true
            }
            return false
       })
        console.log(valid)
        return valid[0]
    } else {

        let compararStart = Date.parse(dateStarts)
        let compararEnd = Date.parse(end)

       const valid = listManagement.map(element => {
        let dateStart = Date.parse(ConvertirFecha2(element.startDate))
           let dateEnd = Date.parse(ConvertirFecha2(element.endDate))
           console.log(dateEnd)
            if (compararStart >= dateStart && compararStart <= dateEnd) {
                return true
            } else if (compararEnd >= dateEnd && compararEnd <= dateEnd) {
                return true
            } else if (compararStart <= dateStart && compararEnd >= dateStart) {
                return true
            }
            return false
        })

        return valid[0]
      }
}

function validateFields(id) {
    const management = getData()
    if (management.nameManagement === '') {
        generadorAlertas('error', 'Error', 'Campo Nombre Vacio')
        return false
    } else if (management.endDate === '') {
        generadorAlertas('error', 'Error', 'Campo Fecha Inicio Vacia')
        return false
    } else if (management.startDate === '') {
        generadorAlertas('error', 'Error', 'Campo Fecha Fin Vacio')
        return false
    } else if (management.nameManagement.length >80) {

        generadorAlertas('error', 'Error', 'Longitud maxima es de 80')
        return false
    }
    else if (management.idManagement === 0) {


        //Validation to create new management 
        console.log('creando')
        let isValid = !!listManagement.find(item => item.nameManagement === management.nameManagement)
        let isValidManagement = listManagement.filter(item => item.idManagement !== id && item.state !== 0)
        if (isValid) {
            generadorAlertas('error', 'Error', 'No pueden existir mas de dos gestiones abiertas')
            return false
        } else if (isValidManagement.length >=2) {
            generadorAlertas('error', 'Error', 'No pueden existir mas de dos gestiones abiertas')
            return false
        }
    } else {
        //Validation to edit new Management
        let newArr = listManagement.filter(item => item.idManagement === management.idManagement)
        if (newArr.length === 2) {
            generadorAlertas('error', 'Error', 'No puede crear una gestion,tiene que cerrar una')
        } else {
            console.log('bien')
        }
            console.log('edit')
    }
    return true
}

function validateDatesCreateStart(dateStart) {
    let isValid = (dateElement) => {
        console.log(ConvertirFecha2(dateElement.startDate), dateStart)
        let primera = Date.parse(ConvertirFecha2(dateElement.startDate))
        let segunda = Date.parse(dateStart)
        console.log(primera, segunda)
        return primera >= segunda

    }
    return listManagement.some(isValid)
}

