import Axios from "axios"
const AxiosAjustes =async () => {
    const jwToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hdGVpdG8iLCJpYXQiOjE2OTAzODQyOTcsImV4cCI6MTY5MDY0MzQ5N30.kHVUX8F2i7WCqWTqqJ-8GFF3C5Nv-tRsgAekJOGGKs4'
    const urlAjustes = 'https://inventarioproductos.onrender.com/ajustes'
    const response =await Axios({url:`${urlAjustes}`, headers:{'Authorization':`${jwToken}`}})
    return (await response).data
}
export default AxiosAjustes;
