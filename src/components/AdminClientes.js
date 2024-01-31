import React, { useEffect, useState, useContext } from 'react';
import ImgProd from '../assets/img/Switch_productos_nuevo.webp';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';
import { app } from '../fb';
import PDFButton from "./PDFButton";
import PDFButtonProducts from "./PDFButtonProducts";
import App from '../App';
import AxiosCliente from './AxiosCliente';

const AdminClientes = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [cliente, setCliente] = useState([]);
    const [cli_id, set_cliId] = useState('');
    const [cli_nombre, setcliNombre] = useState('');
    const [cli_apellido, setcliApellido] = useState('');
    const [cli_email, setcliEmail] = useState('');
    const [cli_telefono, setcliTelefono] = useState('');
    const [pro_pvp, setproPvp] = useState('');
    const [pro_imagen, setproImagen] = useState('');
    const [cli_estado, setCliEstado] = useState('');
    const [pro_stock, setproStock] = useState('');
    const [operation, setoperation] = useState(1);
    const [title, setTittle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoriaOptions, setCategoriaOptions] = useState([]);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [docus, setDocus] = useState([]);

    //PDFC/U
    const [selectedProductId, setSelectedProductId] = useState(null);

    //Búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("");

    const columns = [
        { value: "", label: "Buscar en todas las columnas" },
        { value: "cli_id", label: "ID" },
        { value: "cli_nombre", label: "Nombre del cliente" },
        { value: "cli_apellido", label: "Apellido" },
    ];

    const filteredClientes = cliente.filter((clientes) => {
        if (searchColumn === "") {
            // Buscar en todas las columnas
            const searchFields = [
                clientes.cli_nombre,
                clientes.cli_email,
                clientes.cli_telefono,
                clientes.cli_id.toString(), // Agrega cli_id a los campos de búsqueda
            ];
            console.log("CAMPOS")
            console.log(searchFields)
            return searchFields.some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (searchColumn === "cli_id") {
            // Buscar en el campo cli_id
            const fieldValue = clientes.cli_id.toString();
            return fieldValue.includes(searchTerm);
        } else {
            // Buscar en una columna específica
            const fieldValue = clientes[searchColumn];
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredClientes.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    useEffect(() => {
        getClientes();
    }, []);

    useEffect(() => {
        console.log(cliente)
    }, [cliente])

    const getClientes = async () => {
        try {
            const clientes = await AxiosCliente('/clientes', null, 'get');
            setCliente(clientes);
            console.log(clientes);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchTerm(""); // Reiniciar el término de búsqueda al cambiar la columna
    };

    const openModal = (op, cli_id, cli_nombre, cli_apellido, cli_email, cli_telefono, cli_estado) => {
        set_cliId('');
        setcliNombre('');
        setcliApellido('');
        setcliEmail('');
        setcliTelefono('');
        setCliEstado(true);
        setModalOpen(true);
        setoperation(op);
        if (op === 1) {
            setTittle('Registrar cliente');
        } else if (op === 2) {
            setTittle('Actualizar cliente');
            set_cliId(cli_id);
            setcliNombre(cli_nombre);
            setcliApellido(cli_apellido);
            setcliEmail(cli_email);
            setcliTelefono(cli_telefono);
            setCliEstado(cli_estado);
        }
        window.setTimeout(function () {
            document.getElementById('cli_nombre').focus();
        }, 500);
    };

    const closeModal = () => {
        setModalOpen(false);
        getClientes();
    };

    const validar = async () => {
        var parametros;
        var metodo;
        var urlOperacion;
        if (cli_nombre.trim() === '') {
            show_alerta('Escribe el nombre del cliente', 'warning');
        } else if (cli_apellido.trim() === '') {
            show_alerta('Escribe el apellido del cliente', 'warning');
        } else if (cli_email.trim() === '') {
            show_alerta('Escribe el email del cliente', 'warning');
        } else if (cli_estado === '') {
            show_alerta('Escribe el estado del cliente', 'warning');
        } else {
            parametros = {
                cli_nombre: cli_nombre,
                cli_apellido: cli_apellido,
                cli_email: cli_email,
                cli_telefono: cli_telefono,
                cli_estado: cli_estado
            };
            if (operation === 1) {
                metodo = 'post';
                urlOperacion = '/clientes/nuevo';
            } else {
                actualizarProducto();
            }
            enviarSolicitud(metodo, urlOperacion, parametros);
        }
    };

    const enviarSolicitud = async (metodo, urlOperacion, parametros) => {
        try {
            const respuesta = await AxiosCliente(urlOperacion, null, metodo, parametros);
            if (respuesta != null) {
                show_alerta('Guardado'); // Mostrar mensaje "Guardado"
                closeModal(); // Cerrar modal y recargar clientes
                console.log("telefono" + cli_telefono);
                console.log("CLI_ID"+respuesta['response']['cli_id'])
                console.log(respuesta)
                console.log("valor pvp actual" + pro_pvp);
            } else {
                show_alerta('Error en la respuesta del servidor', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const actualizarProducto = async () => {
        try {
            const parametros = {
                cli_id: cli_id,
                cli_nombre: cli_nombre,
                cli_apellido: cli_apellido,
                cli_email: cli_email,
                cli_telefono: cli_telefono,
                cli_estado: cli_estado
            };
            console.log("ACTUALIZAR")
            console.log(cli_estado)
            const metodo = 'put';
            const urlOperacion = '/clientes/actualizar';
            enviarSolicitud(metodo, urlOperacion, parametros);
            setSelectedCategory(null);
        } catch (error) {
            console.log(error);
        }
    };

    const archivoHandler = async (e) => {
        const archivo = e.target.files[0];
        const storageRef = app.storage().ref();
        const archivoPath = storageRef.child(archivo.name);
        await archivoPath.put(archivo);
        console.log("Archivo cargado: " + archivo.name);
        const enlaceUrl = await archivoPath.getDownloadURL();
        setproImagen(enlaceUrl);
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const nombreArchivo = e.target.nombre.value;
        const coleccionRef = app.firestore().collection("archivosInventario");
        const docu = await coleccionRef.doc(nombreArchivo).set({ nombre: nombreArchivo, url: pro_imagen });
        console.log("Archivo cargado exitosamente: ", nombreArchivo, "url:", pro_imagen);
    }

    return (
        <div className="App">
            <div className="mx-auto px-3">
                <div className="flex mt-4">
                    <div className="w-1/2 ">
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
                                placeholder="Buscar Cliente..."
                                className="p-2 border-2 border-gray-200 rounded-md"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <button onClick={() => openModal(1)} className="bg-dark-purple text-white p-3 rounded">
                                <i className="fa-solid fa-circle-plus"></i>Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/1 p-3">
                    <table className="border-collapse divide-y divide-x divide-gray-500 text-center">
                        <thead className="bg-dark-purple  text-white">
                            <tr>
                                <th className="px-4 py-2 text-center text-sm">OPCIONES</th>
                                <th className="px-4 py-2 text-center text-sm">ID</th>
                                <th className="px-4 py-2 text-center text-sm">NOMBRE</th>
                                <th className="px-4 py-2 text-center text-sm">APELLIDO</th>
                                <th className="px-20 py-2 text-center text-sm">EMAIL</th>
                                <th className="px-20 py-2 text-center text-sm">TELÉFONO</th>
                                <th className="px-4 py-2 text-center text-sm">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-300">
                            {currentProducts.map((clientes, index) => {
                                return (
                                    <tr
                                        key={clientes.cli_id}
                                        className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                                    >
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        2,
                                                        clientes.cli_id,
                                                        clientes.cli_nombre,
                                                        clientes.cli_apellido,
                                                        clientes.cli_email,
                                                        clientes.cli_telefono,
                                                        clientes.cli_estado,
                                                    )
                                                }
                                                className="bg-dark-purple p-2 rounded-full"
                                                style={{ width: '37px', height: '40px', marginRight: '10px' }}
                                            >
                                                <i className="fa-solid fa-edit text-white"></i>
                                            </button>
                                        </td>
                                        <td>{clientes.cli_id}</td>
                                        <td>{clientes.cli_nombre}</td>
                                        <td>{clientes.cli_apellido}</td>
                                        <td>{clientes.cli_email}</td>
                                        <td>{clientes.cli_telefono}</td>
                                        <td>{clientes.cli_estado ? "Activo" : "Inactivo"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {imageModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                            <div className="bg-white relative rounded-lg">
                                <img src={selectedImageUrl} alt="Selected Product" height="500px" width="500px" />

                                <button
                                    type="button"
                                    id="btnCerrar"
                                    className="btn btn-secondary bg-dark-purple text-white p-3 rounded absolute top-2 right-2"
                                    onClick={() => {
                                        setImageModalOpen(false);
                                        setSelectedImageUrl("");
                                    }}
                                >
                                    <i className="fa-solid fa-window-close"></i> Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex mt-4 justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Previous</span>
                            {/* Heroicon name: solid/chevron-left */}
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {/* Example pagination links */}
                        {Array.from({ length: Math.ceil(cliente.length / productsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                className={`relative inline-flex items-center px-4 py-2 border ${currentPage === index + 1 ? 'bg-dark-purple text-white' : 'border-gray-300 bg-white text-gray-700'
                                    } text-sm font-medium hover:bg-gray-50`}
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
                <form onSubmit={submitHandler}>
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg w-1/3">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <p className="text-lg font-bold">{title}</p>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="p-6">
                                <input type="hidden" id="id" />
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-navicon"></i>
                                        <label className="text-sm">Nombre</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="cli_nombre"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Nombre"
                                        name="nombre"
                                        value={cli_nombre}
                                        onChange={(e) => setcliNombre(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-pencil"></i>
                                        <label className="text-sm">Apellido</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="cli_apellido"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Descripción"
                                        value={cli_apellido}
                                        onChange={(e) => setcliApellido(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-pencil"></i>
                                        <label className="text-sm">Teléfono</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="cli_apellido"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Teléfono"
                                        value={cli_telefono}
                                        onChange={(e) => setcliTelefono(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-envelope"></i>
                                        <label className="text-sm">Email</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="cli_email"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Email"
                                        value={cli_email}
                                        onChange={(e) => setcliEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-edit"></i>
                                        <label className="text-sm">Estado</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="cli_estado"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={cli_estado}
                                            onChange={(e) => setCliEstado(e.target.checked)}
                                        />
                                        <p>{cli_estado ? "Activo" : "Inactivo"}</p>
                                    </div>
                                </div>
                                <div className="d-grid col-6 mx-auto flex justify-center">
                                    <button onClick={() => validar()} className="bg-dark-purple text-white p-3 rounded">
                                        <i className="fa-solid fa-floppy-disk"></i> Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

export default AdminClientes;