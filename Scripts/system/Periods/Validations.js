function validatePeriod(period) {
    if (validateFields(period.idPeriod)) {
        if (validateDateManagement(period.startDate, period.endDate)) {

            if (ValidarFechaInimenorqueFin(period.startDate, period.endDate)) {

                if (validateDatesCreateEnd(period.startDate, period.idPeriod, period.endDate)) {
                    generadorAlertas('error', 'Error', 'Solapamiento de Fechas,Fecha inicio se superpone con otra')
                    return false
                }
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

    } else {
        return false
    } 


}

function validateDateManagement(compareStart, compareEnd) {
    let start = Date.parse(compareStart)
    let end = Date.parse(compareEnd)
    let compareManagementStart = Date.parse(ConvertirFecha2(startDateManagement))
    let compareManagementEnd = Date.parse(ConvertirFecha2(endDateManagement))
    if (start < compareManagementStart || start > compareManagementEnd) {
                generadorAlertas('error', 'Error', 'Se salio del rango de la gestion establecida')
        return false
    } else if (end < compareManagementStart || end > compareManagementEnd) {
                generadorAlertas('error', 'Error', 'Se salio del rango de la gestion establecida')
        return false
    }
    return true
}



function validateFields(id) {
    const periods = getData()
    console.log('hello')
    if (periods.namePeriod === '') {
        generadorAlertas('error', 'Error', 'Campo Nombre Vacio')
        return false
    } else if (periods.endDate === '') {
        generadorAlertas('error', 'Error', 'Campo Fecha Inicio Vacia')
        return false
    } else if (periods.startDate === '') {
        generadorAlertas('error', 'Error', 'Campo Fecha Fin Vacio')
        return false
    } else if (periods.namePeriod.length >80) {

        generadorAlertas('error', 'Error', 'Longitud maxima es de 80')
        return false
    }
    //else if (periods.idPeriod === 0) {
    //    //Validation to create new periods 
    //    console.log('creando')
    //    let isValid = !!listPeriod.find(item => item.namePeriod.toUpperCase() === periods.namePeriod.toUpperCase())
    //    let isValidPeriod = listPeriod.filter(item => item.idPeriod !== id && item.state !== 0)
    //    console.log(isValidPeriod)
    //    if (isValid) {
    //        generadorAlertas('error', 'Error', 'No puede haber gestiones repetidas')
    //        return false
    //    } else if (isValidPeriod.length >=2) {
    //        generadorAlertas('error', 'Error', 'No puede crear una gestion,tiene que cerrar una')
    //        return false
    //    }
    // }
        //else {
        ////Validation to edit new periods
        //let newArr = listPeriod.filter(item => item.idPeriod === periods.idPeriod)
        //if (newArr.length === 2) {
        //    generadorAlertas('error', 'Error', 'No pueden existir mas de dos gestiones abiertas')
        //} else {
        //    console.log('bien')
        //}
            //console.log('edit')
    //}
    return true
}

function validateDatesCreateEnd(dateStarts, id, end) {
    console.log('entrando a validacion buena')
    if (id !== 0) {
        let filter = listPeriod.filter(item => item.idPeriod !== id)

        let compararStart = Date.parse(dateStarts)
        let compararEnd = Date.parse(end)

       const valid = filter.map(element => {
            let dateStart = Date.parse(ConvertirFecha2(element.startDate))
            let dateEnd = Date.parse(ConvertirFecha2(element.endDate))

            if (compararStart >= dateStart && compararStart <= dateEnd) {
                console.log('entro')
                return true
                           } else if (compararEnd >= dateEnd && compararEnd <= dateEnd) {
                console.log('entro')
                return true

            } else if (compararStart <= dateStart && compararEnd >= dateStart) {
                console.log('entro')
                return true
            }
            console.log('no entro')
            return false
       })
        console.log(valid)
        return valid[0]
    } else {

        let compararStart = Date.parse(dateStarts)
        let compararEnd = Date.parse(end)

       const valid = listPeriod.map(element => {
        let dateStart = Date.parse(ConvertirFecha2(element.startDate))
           let dateEnd = Date.parse(ConvertirFecha2(element.endDate))
           console.log(element)
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





