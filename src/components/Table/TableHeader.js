import React from 'react'

const TableHeader = () => {
    return (
        <tr>
            <th className='border border-t-2 border-t-black border-b-2 border-b-black'>
                Fecha
            </th>
            <th className='border border-t-2 border-t-black border-b-2 border-b-black w-16'>
                Documento
            </th>
            <th className='border border-t-2 border-t-black border-b-2 border-b-black'>
                Descripción
            </th>
            <th className='border border-t-2 border-t-black border-b-2 border-b-black w-16'>
                Cantidad
            </th>
            <th className='border border-t-2 border-t-black border-b-2 border-b-black'>
                Stock
            </th>
        </tr>
    )
}

export default TableHeader