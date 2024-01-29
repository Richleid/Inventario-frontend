import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';

const AdminVentas = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [ventas, setVentas] = useState([]);
    const [ven_id, setVenId] = useState('');
    const [cli_id, setCliId] = useState('');
    const [pro_id, setProId] = useState('');
    const [ven_fecha, setVenFecha] = useState('');
    const [ven_cantidad, setVenCantidad] = useState('');
    const [ven_total, setVenTotal] = useState('');
    const [ven_estado, setVenEstado] = useState(true);
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');


    // Estados para clientes y productos
    const [clienteOptions, setClienteOptions] = useState([]);
    const [productoOptions, setProductoOptions] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedProducto, setSelectedProducto] = useState('');

    //Búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("");

    const columns = [
        { value: "", label: "Buscar en todas las columnas" },
        { value: "ven_id", label: "ID Venta" },
        { value: "nombre_cliente", label: "Nombre Cliente" },
        { value: "nombre_producto", label: "Nombre producto" },
    ];

    const filteredVentas = ventas.filter((venta) => {
        if (searchColumn === "") {
            // Buscar en todas las columnas
            const searchFields = [
                venta.ven_id.toString(),
                venta.nombre_cliente,
                venta.nombre_producto,
            ];
            return searchFields.some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (searchColumn === "ven_id") {
            // Buscar en el campo pro_id
            const fieldValue = venta.ven_id.toString();
            return fieldValue.includes(searchTerm);
        } else {
            // Buscar en una columna específica
            const fieldValue = venta[searchColumn];
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const ventasPerPage = 5;

    const indexOfLastVenta = currentPage * ventasPerPage;
    const indexOfFirstVenta = indexOfLastVenta - ventasPerPage;
    const currentVentas = filteredVentas.slice(
        indexOfFirstVenta,
        indexOfLastVenta
    );

    useEffect(() => {
        getVentas();
        getClientes();
        getProductos();
        getClienteIdFromName();
        getProductoIdFromName();
    }, []);

    const getVentas = async () => {
        try {
            const venta = await AxiosProducto('/ventas', null, 'get');
            setVentas(venta);
            console.log(venta);
        } catch (error) {
            console.error('Error fetching products', error);
            // Luego puedes usar show_alerta(error.message) para mostrar el error al usuario si deseas
        }
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    

    
    const getClientes = async () => {
        try {
            const clientes = await AxiosProducto('/clientes', null, 'get');
            setClienteOptions(clientes.map((cliente) => cliente.cli_nombre));
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const getProductos = async () => {
        try {
            const productos = await AxiosProducto('/productos', null, 'get');
            setProductoOptions(productos.map((producto) => producto.pro_nombre));
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };


    const getClienteIdFromName = async (clienteName) => {
        try {
            const response = await AxiosProducto(`/clientes/nombre/${clienteName}`, null, 'get');
            console.log('Respuesta de cliente:', response);
            if (response && response.length > 0) {
                return response[0];
            } else {
                console.error('Cliente no encontrado o respuesta inesperada:', response);
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el cliente:", error);
            return null;
        }
    };
    
    const getProductoIdFromName = async (productoName) => {
        try {
            const response = await AxiosProducto(`/productos/nombre/${productoName}`, null, 'get');
            console.log('Respuesta de producto:', response);
            if (response && response.length > 0) {
                return response[0];
            } else {
                console.error('Producto no encontrado o respuesta inesperada:', response);
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            return null;
        }
    };
    

    const handleClienteChange = (event) => {
        setSelectedCliente(event.target.value);
    };

    const handleProductoChange = (event) => {
        setSelectedProducto(event.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchTerm(""); // Reiniciar el término de búsqueda al cambiar la columna
    };

    const openModal = (op, venId, cliId, proId, venFecha, venCantidad, venTotal, venEstado) => {
        setVenId('');
        setCliId('');
        setProId('');
        setVenFecha('');
        setVenCantidad('');
        setVenTotal('');
        setVenEstado(true); // Por defecto, la venta está activa
        setOperation(op);
        setModalOpen(true);

        if (op === 1) {
            setTitle('Registrar Venta');
        } else if (op === 2) {
            setTitle('Actualizar Venta');
            setVenId(venId);
            setCliId(cliId);
            setProId(proId);
            setVenFecha(venFecha);
            setVenCantidad(venCantidad);
            setVenTotal(venTotal);
            setVenEstado(venEstado);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        getVentas();
    };

    const validar = async () => {
        if (selectedCliente === '') {
            show_alerta('Elige un cliente', 'warning');
            return;
        } 
        if (selectedProducto === '') {
            show_alerta('Elige un producto', 'warning');
            return;
        } 
        if (!ven_fecha) {
            show_alerta('Por favor, selecciona una fecha.', 'warning');
            return;
        } 
        if (ven_cantidad <= 0) {
            show_alerta('La cantidad debe ser mayor que 0.', 'warning');
            return;
        } 
        if (ven_total <= 0) {
            show_alerta('El total debe ser mayor que 0.', 'warning');
            return;
        } 
        
        const clienteObject = await getClienteIdFromName(selectedCliente);
        const productoObject = await getProductoIdFromName(selectedProducto);
    
        if (clienteObject && productoObject) {
            const parametros = {
                cli_id: clienteObject.cli_id,
                pro_id: productoObject.pro_id,
                ven_fecha: ven_fecha,
                ven_cantidad: ven_cantidad,
                ven_total: ven_total,
                ven_estado: ven_estado
            };
    
            let metodo;
            let urlOperacion;
            if (operation === 1) {
                metodo = 'post';
                urlOperacion = '/ventas/nuevo';
            } else {
                // Asegúrate de que la función actualizarVenta retorne los valores adecuados.
                const updateInfo = await actualizarVenta();
                metodo = updateInfo.metodo;
                urlOperacion = updateInfo.urlOperacion;
            }
    
            await enviarSolicitud(metodo, urlOperacion, parametros);
        } else {
            show_alerta('No se pudieron obtener los ID del cliente o del producto', 'error');
        }
    };
    

// Asegúrate de que las funciones getClienteIdFromName y getProductoIdFromName estén definidas y manejen las solicitudes correctamente


// Asegúrate de que las funciones actualizarVenta y enviarSolicitud estén definidas y manejen las solicitudes correctamente


// Función para enviar la solicitud a la API y manejar la respuesta
const enviarSolicitud = async (metodo, urlOperacion, parametros) => {
    try {
        const respuesta = await AxiosProducto(urlOperacion, null, metodo, parametros);
        if (respuesta != null) {
            show_alerta('Guardado'); // Mostrar mensaje "Guardado"
            closeModal(); // Cerrar modal y recargar productos
        } else {
            show_alerta('Error en la respuesta del servidor', 'error');
        }
    } catch (error) {
        console.log(error);
    }
};


const actualizarVenta = async () => {
    try {
        const clienteObject = await getClienteIdFromName(selectedCliente);
        const productoObject = await getProductoIdFromName(selectedProducto);
        const parametros = {
            ven_id: ven_id,
            cli_id: clienteObject.cli_id,
            pro_id: productoObject.pro_id,
            ven_fecha: ven_fecha,
            ven_cantidad: ven_cantidad,
            ven_total: ven_total,
            ven_estado: ven_estado
        };
        const metodo = 'put';
        const urlOperacion = '/ventas/actualizar';
        enviarSolicitud(metodo, urlOperacion, parametros);
        setSelectedCliente(null);
        setSelectedProducto(null);
    } catch (error) {
        console.log(error);
        // Maneja el error según tus necesidades
    }
};
// Otras funciones como eliminarVenta podrían ser implementadas de manera similar
const eliminarVenta = async (ven_id) => {
    try {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (confirmacion.isConfirmed) {
            await AxiosProducto(`/ventas/eliminar/${ven_id}`, null, 'delete');
            show_alerta('Venta eliminada con éxito', 'success');
            getVentas();
        }
    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        show_alerta(`Error: ${error.message}`, 'error');
    }
};

    return (
        <div className="App">
        <div className="mx-auto px-3">
            <div className="flex mt-4">
                <div className="w-full">
                    <div className="flex justify-between">
                        <select
                            value={searchColumn}
                            onChange={handleColumnChange}
                            className="p-2 border-2 border-gray-200 rounded-md"
                        >
                            {columns.map((column) => (
                                <option key={column.value} value={column.value}>
                                    {column.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Buscar venta..."
                            className="p-2 border-2 border-gray-200 rounded-md mx-2"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <button onClick={() => openModal(1)} className="bg-dark-purple text-white p-3 rounded">
                            <i className="fa-solid fa-circle-plus"></i> Añadir Venta
                        </button>
                    </div>
                </div>
            </div>
            <div className="lg:w-full p-3 mt-4">
            <table className="border-collapse divide-y divide-x divide-gray-500 text-center w-full">
    <thead className="bg-dark-purple text-white">
        <tr>
            <th className="px-4 py-2 text-center text-sm">OPCIONES</th>
            <th className="px-4 py-2 text-center text-sm">ID Venta</th>
            <th className="px-4 py-2 text-center text-sm">CLIENTE</th>
            <th className="px-4 py-2 text-center text-sm">PRODUCTO</th>
            <th className="px-4 py-2 text-center text-sm">FECHA</th>
            <th className="px-4 py-2 text-center text-sm">CANTIDAD</th>
            <th className="px-4 py-2 text-center text-sm">TOTAL</th>
            <th className="px-4 py-2 text-center text-sm">ESTADO</th>
        </tr>
    </thead>
    <tbody className="divide-y-2 divide-gray-300">
        {currentVentas.map((venta, index) => (
            <tr key={venta.ven_id} className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                <td className="px-4 py-4">
                    <button
                        onClick={() => openModal(2, venta.ven_id, venta.cli_id, venta.pro_id, venta.ven_fecha, venta.ven_cantidad, venta.ven_total, venta.ven_estado)}
                        className="bg-dark-purple p-2 rounded-full mx-1"
                    >
                        <i className="fa-solid fa-edit text-white"></i>
                    </button>
                </td>
                <td className="px-4 py-4">{venta.ven_id}</td>
                <td className="px-4 py-4">{venta.nombre_cliente}</td>
                <td className="px-4 py-4">{venta.nombre_producto}</td>
                <td className="px-4 py-4">{venta.ven_fecha.split("T")[0]}</td>
                <td className="px-4 py-4">{venta.ven_cantidad}</td>
                <td className="px-4 py-4">{venta.ven_total}</td>
                <td className="px-4 py-4">{venta.ven_estado ? 'Activo' : 'Inactivo'}</td>
            </tr>
        ))}
    </tbody>
</table>

            </div>
            <div className="flex mt-4 justify-center">
                {/* Pagination */}
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        {/* Heroicon name: solid/chevron-left */}
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {/* Example pagination links */}
                    {Array.from({ length: Math.ceil(ventas.length / ventasPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            className={`relative inline-flex items-center px-4 py-2 border ${currentPage === index + 1 ? 'bg-dark-purple text-white' : 'border-gray-300 bg-white text-gray-700'} text-sm font-medium hover:bg-gray-50`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        {/* Heroicon name: solid/chevron-right */}
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
        {modalOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
       <div className="bg-white rounded-lg w-1/3">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <p className="text-lg font-bold">{title}</p>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-user"></i>
                        <label className="text-sm">Cliente</label>
                    </div>
                    <select
                        id="cli_id"
                        className="border border-gray-200 rounded px-3 py-2 w-full"
                        value={selectedCliente || ''}
                        onChange={handleClienteChange}
                    >
                        <option value="">Selecciona un Cliente</option>
                        { clienteOptions.map((cliente , index) => (
                            <option key={index} value={cliente.cli_id}>
                                {cliente} {/* Asegúrate de que 'nombre' sea una propiedad válida del objeto cliente */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-box"></i>
                        <label className="text-sm">Producto</label>
                    </div>
                    <select
                        id="pro_id"
                        className="border border-gray-200 rounded px-3 py-2 w-full"
                        value={selectedProducto || ''}
                        onChange={handleProductoChange}
                    >
                        <option value="">Selecciona un Producto</option>
                        {productoOptions.map((producto, index) => (
                            <option key={index} value={producto.pro_id}>
                                {producto} {/* Asegúrate de que 'nombre' sea una propiedad válida del objeto producto */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-calendar"></i>
                        <label className="text-sm">Fecha</label>
                    </div>
                    <input
                        type="date"
                        id="ven_fecha"
                        className="border border-gray-200 rounded px-3 py-2 w-full"
                        value={ven_fecha.split("T")[0]}
                        onChange={(e) => setVenFecha(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-hashtag"></i>
                        <label className="text-sm">Cantidad</label>
                    </div>
                    <input
                        type="number"
                        id="ven_cantidad"
                        className="border border-gray-200 rounded px-3 py-2 w-full"
                        placeholder="Cantidad"
                        value={ven_cantidad}
                        onChange={(e) => setVenCantidad(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-dollar-sign"></i>
                        <label className="text-sm">Total</label>
                    </div>
                    <input
                        type="number"
                        id="ven_total"
                        className="border border-gray-200 rounded px-3 py-2 w-full"
                        placeholder="Total"
                        value={ven_total}
                        onChange={(e) => setVenTotal(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-toggle-on"></i>
                        <label className="text-sm">Estado</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="ven_estado"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            checked={ven_estado}
                            onChange={(e) => setVenEstado(e.target.checked)}
                        />
                        <p>{ven_estado ? "Activo" : "Inactivo"}</p>
                    </div>
                </div>
                <div className="d-grid col-6 mx-auto flex justify-center">
                    <button onClick={validar} className="bg-dark-purple text-white p-3 rounded">
                        <i className="fa-solid fa-floppy-disk"></i> Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
 </div>
    );
}

export default AdminVentas;