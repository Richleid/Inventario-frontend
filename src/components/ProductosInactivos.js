import React, { useEffect, useState, useContext } from 'react';
import ImgProd from '../assets/img/Switch_productos_nuevo.webp';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import AxiosProducto from '../components/AxiosProducto';
import { app } from '../fb';
import App from '../App';

const ProductosInactivos = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [producto, setProductos] = useState([]);
    const [pro_id, set_proId] = useState('');
    const [pro_nombre, setproNombre] = useState('');
    const [pro_descripcion, setproDescripcion] = useState('');
    const [cat_id, setcatId] = useState('');
    const [pro_valor_iva, setproValorIva] = useState('');
    const [pro_costo, setproCosto] = useState('');
    const [pro_pvp, setproPvp] = useState('');
    const [pro_imagen, setproImagen] = useState('');
    const [pro_estado, setproEstado] = useState('');
    const [pro_stock, setproStock] = useState('');
    const [operation, setoperation] = useState(1);
    const [title, setTittle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categoriaOptions, setCategoriaOptions] = useState([]);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState("");
    const [docus, setDocus] = useState([]);

    //Búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("");

    const columns = [
        { value: "", label: "Buscar en todas las columnas" },
        { value: "pro_id", label: "ID" },
        { value: "pro_nombre", label: "Nombre del producto" },
        { value: "pro_descripcion", label: "Descripción" },
        { value: "cat_nombre", label: "Categoría" },
    ];

    const filteredProducts = producto.filter((productos) => {
        if (searchColumn === "") {
            // Buscar en todas las columnas
            const searchFields = [
                productos.pro_nombre,
                productos.pro_descripcion,
                productos.cat_nombre,
                productos.pro_id.toString(), // Agrega pro_id a los campos de búsqueda
            ];
            return searchFields.some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (searchColumn === "pro_id") {
            // Buscar en el campo pro_id
            const fieldValue = productos.pro_id.toString();
            return fieldValue.includes(searchTerm);
        } else {
            // Buscar en una columna específica
            const fieldValue = productos[searchColumn];
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
    //Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    useEffect(() => {
        getProductos();
        getCategorias();
        getCategoryIdFromName();
        subida();
    }, []);

    const getProductos = async () => {
        try {
            const productos = await AxiosProducto('/productosD', null, 'get');
            setProductos(productos);
            console.log(productos);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const getCategorias = async () => {
        try {
            const categorias = await AxiosProducto('/categorias', null, 'get');
            setCategoriaOptions(categorias.map((categoria) => categoria.cat_nombre));
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const getCategoryIdFromName = async (categoryName) => {
        try {
            const response = await AxiosProducto(`/categorias/nombre/${categoryName}`, null, 'get');
            const category = response;
            console.log(category);

            // Verifica si se encontró la categoría y devuelve el objeto de categoría completo
            if (category && category.length > 0) {
                const categoryObject = category[0];
                return categoryObject;
            } else {
                return null; // Maneja el caso en que no se haya encontrado la categoría por nombre
            }
        } catch (error) {
            console.error("Error al obtener la categoría:", error);
            return null; // Maneja cualquier error que pueda ocurrir al llamar al método de la API
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchTerm(""); // Reiniciar el término de búsqueda al cambiar la columna
    };

    const openModal = (op, pro_id, pro_nombre, pro_descripcion, cat_id, pro_valor_iva, pro_costo, pro_pvp, pro_imagen, pro_estado, pro_stock) => {
        set_proId('');
        setproNombre('');
        setproDescripcion('');
        setcatId('');
        setproValorIva(true);
        setproCosto('');
        setproPvp('');
        setproImagen('');
        setproStock('');
        setproEstado(false);
        setoperation(op);
        setModalOpen(true);
        if (op === 1) {
            setTittle('Registrar producto');
        } else if (op === 2) {
            setTittle('Actualizar producto');
            set_proId(pro_id);
            setproNombre(pro_nombre);
            setproDescripcion(pro_descripcion);
            setcatId(cat_id);
            setproValorIva(pro_valor_iva);
            setproCosto(pro_costo);
            setproPvp(pro_pvp);
            setproImagen(pro_imagen);
            setproEstado(false);
            setproStock(pro_stock);
        }
        window.setTimeout(function () {
            document.getElementById('pro_nombre').focus();
        }, 500);
    };

    const closeModal = () => {
        setModalOpen(false);
        getProductos();
    };

    const validar = async () => {
        var parametros;
        var metodo;
        var urlOperacion;
        if (pro_nombre.trim() === '') {
            show_alerta('Escribe el nombre del producto', 'warning');
        } else if (pro_descripcion.trim() === '') {
            show_alerta('Escribe la descripción del producto', 'warning');
        } else if (selectedCategory === '') {
            show_alerta('Elige la categoría del producto', 'warning');
        } else if (pro_valor_iva === '') {
            show_alerta('Escribe el valor de IVA', 'warning');
        } else if (pro_costo === '') {
            show_alerta('Escribe el costo del producto', 'warning');
        } else if (pro_imagen.trim() === '') {
            show_alerta('Añade una imagen al producto', 'warning');
        } else {
            console.log(selectedCategory);
            const categoryObject = await getCategoryIdFromName(selectedCategory);
            if (categoryObject !== null) {
                parametros = {
                    pro_nombre: pro_nombre,
                    pro_descripcion: pro_descripcion,
                    cat_id: categoryObject.cat_id,
                    pro_valor_iva: pro_valor_iva,
                    pro_costo: pro_costo,
                    pro_imagen: pro_imagen,
                    pro_estado: pro_estado
                };
                if (operation === 1) {
                    metodo = 'post';
                    urlOperacion = '/productos/nuevo';
                } else {
                    actualizarProducto();
                }
                enviarSolicitud(metodo, urlOperacion, parametros);
            } else {
                show_alerta('No se pudo obtener el ID de la categoría seleccionada', 'error');
            }
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

    /*const eliminarProducto = async (pro_id) => {
        try {
            const parametros = { pro_id };
            const respuesta = await AxiosProducto('/productos/delete', null, 'put', parametros);
            if (respuesta != null) {
                show_alerta('Eliminado'); // Mostrar mensaje "Eliminado"
                getProductos(); // Recargar productos
            } else {
                show_alerta('Error en la respuesta del servidor', 'error');
            }
        } catch (error) {
            show_alerta('Error en la solicitud: ' + error.message, 'error');
            console.log(error);
        }
    };*/

    const actualizarProducto = async () => {
        try {
            const parametros = {
                pro_id: pro_id,
                pro_nombre: pro_nombre,
                pro_descripcion: pro_descripcion,
                cat_id: cat_id,
                pro_valor_iva: pro_valor_iva,
                pro_costo: pro_costo,
                pro_imagen: pro_imagen,
                pro_estado: pro_estado
            };
            const metodo = 'put';
            const urlOperacion = '/ActualizarProducto';
            enviarSolicitud(metodo, urlOperacion, parametros);
            setSelectedCategory(null);
        } catch (error) {
            console.log(error);
            // Maneja el error según tus necesidades
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
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

    const subida = async () => {
        const docusList = await app.firestore().collection("archivosInventario").get();
        setDocus(docusList.docs.map((doc) => doc.data()));
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
                                placeholder="Buscar producto..."
                                className="p-2 border-2 border-gray-200 rounded-md w-1/2"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/1 p-3">
                    <table className="border-collapse divide-y divide-x divide-gray-500 text-center">
                        <thead className="bg-dark-purple  text-white">
                            <tr>
                                <th className="px-4 py-2 text-center text-sm">OPCIONES</th>
                                <th className="px-4 py-2 text-center text-sm">ID</th>
                                <th className="px-4 py-2 text-center text-sm">PRODUCTO</th>
                                <th className="px-4 py-2 text-center text-sm">DESCRIPCIÓN</th>
                                <th className="px-4 py-2 text-center text-sm">CATEGORÍA</th>
                                <th className="px-4 py-2 text-center text-sm">IVA</th>
                                <th className="px-4 py-2 text-center text-sm">COSTO</th>
                                <th className="px-4 py-2 text-center text-sm">PVP</th>
                                <th className="px-4 py-2 text-center text-sm">IMAGEN</th>
                                <th className="px-4 py-2 text-center text-sm">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-300">
                            {currentProducts.map((productos, index) => {
                                const imagen = docus.find(
                                    (doc) =>
                                        doc.nombre === productos.pro_nombre &&
                                        doc.url === productos.pro_imagen
                                );

                                return (
                                    <tr
                                        key={productos.pro_id}
                                        className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                                    >
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <button
                                                onClick={() =>
                                                    openModal(
                                                        2,
                                                        productos.pro_id,
                                                        productos.pro_nombre,
                                                        productos.pro_descripcion,
                                                        productos.cat_id,
                                                        productos.pro_valor_iva,
                                                        productos.pro_costo,
                                                        productos.pro_pvp,
                                                        productos.pro_imagen,
                                                        productos.pro_estado,
                                                        productos.pro_stock
                                                    )
                                                }
                                                className="bg-dark-purple p-2 rounded-full"
                                                style={{ width: '37px', height: '40px' }}
                                            >
                                                <i className="fa-solid fa-edit text-white"></i>
                                            </button>
                                        </td>
                                        <td>{productos.pro_id}</td>
                                        <td>{productos.pro_nombre}</td>
                                        <td>{productos.pro_descripcion}</td>
                                        <td>{productos.cat_nombre}</td>
                                        <td>{productos.pro_valor_iva ? '12%' : '0%'}</td>
                                        <td>${new Intl.NumberFormat('en-US').format(productos.pro_costo)}</td>
                                        <td>${new Intl.NumberFormat('en-US').format(productos.pro_pvp)}</td>
                                        <td>
                                            {imagen ? (
                                                <img
                                                    src={imagen.url}
                                                    alt={productos.pro_nombre}
                                                    height="90px"
                                                    width="90px"
                                                    onClick={() => {
                                                        setSelectedImageUrl(imagen.url); // Aquí es donde se realizó el cambio.
                                                        setImageModalOpen(true);
                                                    }}
                                                />
                                            ) : (
                                                'Imagen no encontrada'
                                            )}
                                        </td>
                                        <td>{productos.pro_estado ? 'Activo' : 'Inactivo'}</td>
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
                        {Array.from({ length: Math.ceil(producto.length / productsPerPage) }).map((_, index) => (
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
                                        id="pro_nombre"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Nombre"
                                        name="nombre"
                                        value={pro_nombre}
                                        onChange={(e) => setproNombre(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-pencil"></i>
                                        <label className="text-sm">Descripción</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="pro_descripcion"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Descripción"
                                        value={pro_descripcion}
                                        onChange={(e) => setproDescripcion(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-folder"></i>
                                        <label className="text-sm">Categoría</label>
                                    </div>
                                    <select
                                        id="cat_id"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        value={selectedCategory || ''}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">Elige una categoría</option>
                                        {categoriaOptions.map((categoria, index) => (
                                            <option key={index} value={categoria.cat_id}>
                                                {categoria}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-edit"></i>
                                        <label className="text-sm">IVA</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pro_estado"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={pro_valor_iva}
                                            onChange={(e) => setproValorIva(e.target.checked)}
                                        />
                                        <p>{pro_valor_iva ? "12%" : "0%"}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-dollar"></i>
                                        <label className="text-sm">Costo</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="pro_costo"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Costo"
                                        value={pro_costo}
                                        onChange={(e) => setproCosto(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-edit"></i>
                                        <label className="text-sm">PVP</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="pro_pvp"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder={
                                            Number(pro_costo) * 0.20 +
                                            Number(pro_costo) * (pro_valor_iva ? 0.12 : 0) +
                                            Number(pro_costo)
                                        }
                                        value={Number(pro_costo) * 0.20 +
                                            Number(pro_costo) * (pro_valor_iva ? 0.12 : 0) +
                                            Number(pro_costo)}
                                        disabled={true} // Agrega el atributo "disabled" con el valor true para inhabilitar el input
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-image"></i>
                                        <label className="text-sm">Imagen</label>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center space-x-2 w-full">
                                            <input
                                                type="file"
                                                id="pro_imagen"
                                                className="border border-gray-200 rounded px-3 py-2 w-full hidden"
                                                onChange={archivoHandler}
                                            />
                                            <label
                                                htmlFor="pro_imagen"
                                                className="cursor-pointer bg-dark-purple text-white rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-violet-600 focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                                            >
                                                <i className="fas fa-upload mr-2"></i>Subir archivo
                                            </label>
                                        </div>
                                        {pro_imagen && (
                                            <div className="flex justify-center mt-2 w-full">
                                                <img src={pro_imagen} alt="Imagen anterior" className="w-full" style={{ maxWidth: '80px' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-edit"></i>
                                        <label className="text-sm">Estado</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="pro_estado"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={pro_estado}
                                            onChange={(e) => setproEstado(e.target.checked)}
                                        />
                                        <p>{pro_estado ? "Activo" : "Inactivo"}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <i className="fa-solid fa-edit"></i>
                                        <label className="text-sm">Stock</label>
                                    </div>
                                    <input
                                        type="text"
                                        id="pro_stock"
                                        className="border border-gray-200 rounded px-3 py-2 w-full"
                                        placeholder="Stock"
                                        value={pro_stock}
                                        onChange={(e) => setproStock(e.target.value)}
                                        disabled={true} // Agrega el atributo "disabled" con el valor true para inhabilitar el input
                                    />
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

export default ProductosInactivos;