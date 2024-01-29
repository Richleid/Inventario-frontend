import Axios from 'axios'
import { useEffect, useState } from 'react'

export const AxiosGeneralConsult = (baseUrl, metodo = 'get', jwToken = '') => {
    const [datos, setDatos] = useState()
    useEffect(() => {
        const ObtencionDatos = async () => {
            try {
                let response = []
                if (jwToken !== '') {
                    response = await Axios({ method: `${metodo}`, url: baseUrl, headers: { 'Authorization': `${jwToken}` } }).catch((error) => {
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    })
                } else (
                    response = await Axios({ method: `${metodo}`, url: baseUrl }).catch((error) => {
                        if (error.response) {
                            console.log(error.response.data);
                            console.log(error.response.status);
                            console.log(error.response.headers);
                        } else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error', error.message);
                        }
                        console.log(error.config);
                    })
                )
                setDatos(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        ObtencionDatos()
    }, [baseUrl, metodo, jwToken])
    //console.log(datos)
    return datos;
}
