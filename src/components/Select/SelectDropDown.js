import React from 'react'
import Select from 'react-select'

const SelectDropDown = ({ detallesAjuste = [], onSelectIdDetAjuste }) => {
    const handleSelect = ({ value }) => {
        console.log({ value }.value)
        onSelectIdDetAjuste({ value }.value)
    }
    if (detallesAjuste) {
        return (
            <Select className='ml-2 mr-2 pl-2 pr-2'
                options={detallesAjuste.map(
                    val => ({
                        label: val.aju_det_id,
                        value: val.aju_det_id
                    }))}
                onChange={handleSelect} />
        )
    } else {
        <Select className='ml-2 mr-2 pl-2 pr-2' />
    }
}

export default SelectDropDown