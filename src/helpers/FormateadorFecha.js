import moment from 'moment'

export const FormateadorFecha = (fechaIngreso) => {
    const dateWithZ = fechaIngreso.endsWith("Z");
    let fecha =dateWithZ ?  fechaIngreso.slice(0,-1) : fechaIngreso
    const fechaP = moment(fecha).format('YYYY-MM-DD');
    return fechaP;
}

