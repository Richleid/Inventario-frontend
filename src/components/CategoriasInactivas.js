import React, { useEffect, useState } from 'react';
import ImgProd from '../assets/img/Switch_productos_nuevo.webp';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';

const CategoriaInactivas = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [categoria, setCategorias] = useState([]);
    const [cat_id, setcatId] = useState('');
    const [cat_nombre, setcatNombre] = useState('');
    const [cat_estado, setcatEstado] = useState('');
    const [operation, setoperation] = useState(1);
    const [title, setTittle] = useState('');

    //Búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("");

    const columns = [
        { value: "", label: "Buscar en todas las columnas" },
        { value: "cat_id", label: "ID" },
        { value: "cat_nombre", label: "Nombre de la categoría" },
    ];

    const filteredCategories = categoria.filter((categorias) => {
        if (searchColumn === "") {
            // Buscar en todas las columnas
            const searchFields = [
                categorias.cat_id.toString(), // Agrega pro_id a los campos de búsqueda
                categorias.cat_nombre,
            ];
            return searchFields.some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (searchColumn === "cat_id") {
            // Buscar en el campo pro_id
            const fieldValue = categorias.cat_id.toString();
            return fieldValue.includes(searchTerm);
        } else {
            // Buscar en una columna específica
            const fieldValue = categorias[searchColumn];
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage; 
    const currentCategories= filteredCategories.slice(
        indexOfFirstCategory,
        indexOfLastCategory
    );
    
    useEffect(() => {
        getCategorias();
    }, []);

    const getCategorias = async () => {
        try {
            const categorias = await AxiosProducto('/categoriasD', null, 'get');
            setCategorias(categorias);
            console.log(categorias);
        } catch (error) {
            console.error('Error fetching products', error);
            // Luego puedes usar show_alerta(error.message) para mostrar el error al usuario si deseas
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchTerm(""); // Reiniciar el término de búsqueda al cambiar la columna
    };

    const openModal = (op, cat_id, cat_nombre, cat_estado) => {
        setcatId('');
        setcatNombre('');
        setcatEstado(false);
        setoperation(op);
        setModalOpen(true);
        if (op === 1) {
            setTittle('Registrar Categoría');
        } else if (op === 2) {
            setTittle('Actualizar Categoría');
            setcatId(cat_id);
            setcatNombre(cat_nombre);
            setcatEstado(false);
        }
        window.setTimeout(function () {
            document.getElementById('cat_nombre').focus();
        }, 500);
    };

    const closeModal = () => {
        setModalOpen(false);
        getCategorias();
    };

    const validar = () => {
        var parametros;
        var metodo;
        var urlOperacion;
        if (cat_nombre.trim() === '') {
            show_alerta('Escribe el nombre de la categoría', 'warning');
        } else {
            parametros = {
                cat_nombre: cat_nombre,
                cat_estado: cat_estado
            };
            if (operation === 1) {
                metodo = 'post';
                urlOperacion = '/categorias/nuevo';
            } else {
                actualizarCategoria();
            }
            enviarSolicitud(metodo, urlOperacion, parametros);
        }
    };

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

    const eliminarCategoria = async (cat_id) => {
        try {
            const parametros = { cat_id };
            const respuesta = await AxiosProducto('/categorias/delete', null, 'put', parametros);
            if (respuesta != null) {
                show_alerta('Eliminado'); // Mostrar mensaje "Eliminado"
                getCategorias(); // Recargar productos
            } else {
                show_alerta('Error en la respuesta del servidor', 'error');
            }
        } catch (error) {
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };

    const actualizarCategoria = async () => {
        try {
            // Resto de la lógica para obtener los datos actualizados del producto
            const parametros = {
                cat_id: cat_id,
                cat_nombre: cat_nombre,
                cat_estado: cat_estado
            };
            const metodo = 'put';
            const urlOperacion = '/updateCategoria/' + cat_id;
            enviarSolicitud(metodo, urlOperacion, parametros);
        } catch (error) {
            console.log(error);
            // Maneja el error según tus necesidades
        }
    };
    return (
        <div className="App flex mx-auto px-3 w-full">
            <div className="w-full mx-auto px-3">
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
                                placeholder="Buscar categoría..."
                                className="p-2 border-2 border-gray-200 rounded-md w-1/2"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:w-full p-3">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse divide-y divide-x divide-gray-500 text-center">
                            <thead className="bg-dark-purple  text-white">
                                <tr>
                                    <th className="px-6 py-2 text-center text-sm">OPCIONES</th>
                                    <th className="px-6 py-2 text-center text-sm">ID</th>
                                    <th className="px-6 py-2 text-center text-sm">CATEGORÍA</th>
                                    <th className="px-6 py-2 text-center text-sm">ESTADO</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y-2 divide-gray-300">
                                {currentCategories.map((categorias, index) => (
                                    <tr key={categorias.cat_id} className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                                        <td className="flex justify-around space-x-4 items-center">
                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        2,
                                                        categorias.cat_id,
                                                        categorias.cat_nombre,
                                                        categorias.cat_estado
                                                    )
                                                }
                                                className="bg-dark-purple p-2 rounded-full"
                                                style={{ width: '37px', height: '40px' }}
                                            >
                                                <i className="fa-solid fa-edit text-white"></i>
                                            </button>
                                        </td>
                                        <td>{categorias.cat_id}</td>
                                        <td>{categorias.cat_nombre}</td>
                                        <td>{categorias.cat_estado ? 'Activo' : 'Inactivo'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                        {Array.from({ length: Math.ceil(categoria.length / categoriesPerPage) }).map((_, index) => (
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
                            <div className="flex items-center space-x-2 mb-3">
                                <span className="text-lg">
                                    <i className="fa-solid fa-navicon"></i>
                                </span>
                                <input
                                    type="text"
                                    id="cat_nombre"
                                    className="border border-gray-200 rounded px-3 py-2 w-full"
                                    placeholder="Nombre"
                                    value={cat_nombre}
                                    onChange={(e) => setcatNombre(e.target.value)}
                                ></input>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="flex items-center space-x-2">
                                    <i className="fa-solid fa-edit"></i>
                                    <label className="text-sm">Estado: </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="cat_estado"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={cat_estado}
                                        onChange={(e) => setcatEstado(e.target.value)}
                                    />
                                    <p>{cat_estado ? "Activo" : "Inactivo"}</p>
                                </div>
                            </div>
                            <div className="d-grid col-6 mx-auto flex justify-center">
                                <button onClick={() => validar()} className="bg-dark-purple text-white p-3 rounded">
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer flex justify-end">
                            <button type="button" id="btnCerrar" className="btn btn-secondary bg-dark-purple text-white p-3 rounded" onClick={closeModal}>
                                <i className="fa-solid fa-window-close"></i> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoriaInactivas;