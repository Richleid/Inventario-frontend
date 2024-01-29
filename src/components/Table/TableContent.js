import PropTypes from 'prop-types'
import React from 'react'
import { FormateadorFecha } from '../../helpers/FormateadorFecha'

const TableContent = ({ valor }) => {
    let fecha = FormateadorFecha(valor.fecha)
    return (
        <>
            <tr>
                <td className='border border-gray-300 border-l-white'>
                    {fecha}
                </td>
                <td className='border border-gray-300'>
                    {valor.numeroDocumento}
                </td>
                <td className='border border-gray-300'>
                    {valor.descripcion}
                </td>
                <td className='border border-gray-300 border-r-white'>
                    {valor.cantidad}
                </td>
                <td className='border border-gray-300'>
                    {valor.stock}
                </td>
            </tr>
        </>
    )
}

TableContent.propTypes = {
    valor: PropTypes.any.isRequired
}

export default TableContent
