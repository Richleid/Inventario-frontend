import PropTypes from 'prop-types'
import React from 'react'
import { FormateadorFecha } from '../../helpers/FormateadorFecha'

const CardsContent = (datos) => {
    let fecha = FormateadorFecha(datos.valor.fecha)
    if (datos) {
        return (
            <div className='m-3 mt-5 border-2 border-black w-5/6 h-52 bg-white
         flex flex-col justify-center rounded-md pr-7 pl-7 pb-32 pt-32'>
                <div className='font-bold'>Fecha:</div>
                <div >{fecha}</div>
                <div className='font-bold'>Documento:</div>
                <div>{datos.valor.numeroDocumento}</div>
                <div className='font-bold'>Descripción:</div>
                <div>{datos.valor.descripcion}</div>
                <div className='font-bold'>Cantidad:</div>
                <div>{datos.valor.cantidad}</div>
                <div className='font-bold'>Stock:</div>
                <div>{datos.valor.stock}</div>
            </div>
        )
    }
}

CardsContent.propTypes = {
    datos: PropTypes.any
}

export default CardsContent