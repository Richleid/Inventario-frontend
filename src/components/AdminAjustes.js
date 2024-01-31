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

const AdminAjustes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDosOpen, setModalDosOpen] = useState(false);
  const [ajuste, setAjuste] = useState([]);
  const [pro_id, setProId] = useState('');
  const [aju_det_id, setAjuDetId] = useState('');
  const [aju_numero, setAjuNumero] = useState('');
  const [pro_nombre, setProNombre] = useState('');
  const [aju_det_cantidad, setAjuDetCantidad] = useState('');
  const [tipo_nombre, setTipoNombre] = useState('');
  const [aju_det_tipo, setAjuDetTipo] = useState('')
  //const [tipo_nombre, setTipoNombre] = useState('');
  // const [cli_email, setcliEmail] = useState('');
  // const [cli_telefono, setcliTelefono] = useState('');
  const [aju_det_modificable, setAjuEstado] = useState('');
  const [pro_pvp, setproPvp] = useState('');
  const [pro_imagen, setproImagen] = useState('');
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
    { value: "pro_nombre", label: "Nombre producto" },
    { value: "tipo_nombre", label: "Tipo de ajuste" },
    { value: "aju_det_modificable", label: "Modificable" },
  ];

  const filteredClientes = ajuste.filter((clientes) => {
    if (searchColumn === "") {
      // Buscar en todas las columnas
      const searchFields = [
        clientes.aju_det_cantidad,
        clientes.tipo_nombre,
        clientes.pro_nombre, // Agrega pro_nombre a los campos de búsqueda
      ];
      console.log("CAMPOS")
      console.log(searchFields)
      return searchFields.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchColumn === "pro_nombre") {
      // Buscar en el campo pro_nombre
      const fieldValue = clientes.pro_nombre.toString();
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
    getAjustes();
  }, []);

  useEffect(() => {
    console.log(ajuste)
  }, [ajuste])

  const getAjustes = async () => {
    try {
      const ajustes = await AxiosCliente('/ajustesDetalles', null, 'get');
      setAjuste(ajustes);
      console.log(ajustes);
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

  const openModal = (op, aju_det_id, aju_numero, pro_nombre, aju_det_cantidad, tipo_nombre, aju_det_modificable) => {
    setAjuDetId('');
    setAjuNumero('');
    setProNombre('');
    setAjuDetCantidad('');
    setTipoNombre('');
    setAjuEstado(true);
    setoperation(op);
    if (op === 1) {
      setTittle('Registrar ajuste');
      setModalDosOpen(true);
    } else if (op === 2) {
      setModalOpen(true);
      setTittle('Actualizar ajuste');
      setAjuDetId(aju_det_id);
      setAjuNumero(aju_numero);
      setProNombre(pro_nombre);
      setAjuDetCantidad(aju_det_cantidad);
      setTipoNombre(tipo_nombre);
      setAjuEstado(aju_det_modificable);
    }
    window.setTimeout(function () {
      document.getElementById('aju_det_cantidad').focus();
    }, 500);
  };

  const closeModal = () => {
    setModalOpen(false);
    getAjustes();
  };

  const closeModalDos = () => {
    setModalDosOpen(false);
    getAjustes();
  };

  const validar = async () => {
    var parametros;
    var metodo;
    var urlOperacion;
    if (aju_det_cantidad.trim() === '') {
      show_alerta('Escribe la cantidad', 'warning');
    } else if (aju_det_modificable === '') {
      show_alerta('Escribe el estado del ajuste', 'warning');
    } else {
      parametros = {
        aju_numero:aju_numero,
        pro_id:pro_id,
        aju_det_cantidad: aju_det_cantidad,
        aju_det_modificable:aju_det_modificable,
        aju_det_tipo:aju_det_tipo
      };
      if (operation === 1) {
        metodo = 'post';
        urlOperacion = '/detalles/nuevo';
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
        closeModal();
        closeModalDos(); // Cerrar modal y recargar clientes
        console.log("CLI_ID" + respuesta['response']['pro_nombre'])
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
        aju_det_id: aju_det_id,
        aju_det_cantidad: aju_det_cantidad,
        aju_det_modificable: aju_det_modificable
      };
      console.log("ACTUALIZAR")
      console.log(parametros)
      const metodo = 'put';
      const urlOperacion = '/updateAjusteDetalle';
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
                placeholder="Buscar Ajuste..."
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
            <thead className="bg-dark-purple  text-white w-[100%]">
              <tr>
                <th className="px-4 py-2 text-center text-sm w-[100%]">OPCIONES</th>
                <th className="px-8 py-2 text-center text-sm w-[100%]">N° DETALLE AJUSTE</th>
                <th className="px-8 py-2 text-center text-sm w-[100%]">N° AJUSTE</th>
                <th className="px-16 py-2 text-center text-sm w-[100%]">NOMBRE PRODUCTO</th>
                <th className="px-16 py-2 text-center text-sm w-[100%]">CANTIDAD PRODUCTO</th>
                <th className="px-16 py-2 text-center text-sm w-[100%]">TIPO DE AJUSTE DETALLE</th>
                <th className="px-16 py-2 text-center text-sm w-[100%]">MODIFICABLE</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-300">
              {currentProducts.map((clientes, index) => {
                return (
                  <tr
                    key={clientes.pro_nombre}
                    className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                  >
                    <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                      <button
                        onClick={() =>
                          openModal(
                            2,
                            clientes.aju_det_id,
                            clientes.aju_numero,
                            clientes.pro_nombre,
                            clientes.aju_det_cantidad,
                            clientes.tipo_nombre,
                            clientes.aju_det_modificable,
                          )
                        }
                        className="bg-dark-purple p-2 rounded-full"
                        style={{ width: '37px', height: '40px', marginRight: '10px' }}
                      >
                        <i className="fa-solid fa-edit text-white"></i>
                      </button>
                    </td>
                    <td className='w-[100%]'>{clientes.aju_det_id}</td>
                    <td className='w-[100%]'>{clientes.aju_numero}</td>
                    <td className='w-[100%]'>{clientes.pro_nombre}</td>
                    <td className='w-[100%]'>{clientes.aju_det_cantidad}</td>
                    <td className='w-[100%]'>{clientes.tipo_nombre}</td>
                    <td className='w-[100%]'>{clientes.aju_det_modificable ? "Sí" : "No"}</td>
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
            {Array.from({ length: Math.ceil(ajuste.length / productsPerPage) }).map((_, index) => (
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
                    <i class="fa-solid fa-calendar-days"></i>
                    <label className="text-sm">Cantidad</label>
                  </div>
                  <input
                    type="text"
                    id="aju_det_cantidad"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                    placeholder="Fecha"
                    name="nombre"
                    value={aju_det_cantidad.split("T")[0]}
                    onChange={(e) => setAjuDetCantidad(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-edit"></i>
                    <label className="text-sm">Modificable</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="aju_det_modificable"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={aju_det_modificable}
                      onChange={(e) => setAjuEstado(e.target.checked)}
                    />
                    <p>{aju_det_modificable ? "Activo" : "Inactivo"}</p>
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
      {modalDosOpen && (
        <form onSubmit={submitHandler}>
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-1/3">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <p className="text-lg font-bold">{title}</p>
                <button onClick={closeModalDos} className="text-gray-400 hover:text-gray-500">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="p-6">
                <input type="hidden" id="id" />
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <i class="fa-solid fa-check"></i>
                    <label className="text-sm">N° Ajuste</label>
                  </div>
                  <input
                    type="text"
                    id="pro_id"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                    placeholder="N° Ajuste"
                    name="nombre"
                    value={aju_numero}
                    onChange={(e) => setAjuNumero(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <i class="fa-solid fa-id-card"></i>
                    <label className="text-sm">Id Producto</label>
                  </div>
                  <input
                    type="text"
                    id="pro_id"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                    placeholder="Id Producto"
                    name="nombre"
                    value={pro_id}
                    onChange={(e) => setProId(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <i class="fa-solid fa-arrow-up-short-wide"></i>
                    <label className="text-sm">Cantidad</label>
                  </div>
                  <input
                    type="text"
                    id="aju_det_cantidad"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                    placeholder="Cantidad"
                    name="nombre"
                    value={aju_det_cantidad}
                    onChange={(e) => setAjuDetCantidad(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-edit"></i>
                    <label className="text-sm">Modificable</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="aju_det_modificable"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={aju_det_modificable}
                      onChange={(e) => setAjuEstado(e.target.checked)}
                    />
                    <p>{aju_det_modificable ? "Activo" : "Inactivo"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                   <i class="fa-sharp fa-solid fa-bars-sort"></i>
                    <label className="text-sm">Tipo de ajuste</label>
                  </div>
                  <input
                    type="text"
                    id="aju_det_tipo"
                    className="border border-gray-200 rounded px-3 py-2 w-full"
                    placeholder="Tipo de ajuste"
                    name="nombre"
                    value={aju_det_tipo}
                    onChange={(e) => setAjuDetTipo(e.target.value)}
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

export default AdminAjustes;