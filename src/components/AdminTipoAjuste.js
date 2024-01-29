import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AxiosProducto from '../components/AxiosProducto'; // Asegúrate de que este componente exista y funcione correctamente

const AdminTipoAjuste = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [tipoAjuste, setTipoAjuste] = useState([]);
    const [tipo_id, setTipoId] = useState('');
    const [tipo_nombre, setTipoNombre] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');

    const [searchTerm, setSearchTerm] = useState("");
    const [searchColumn, setSearchColumn] = useState("");

    const columns = [
        { value: "", label: "Buscar en todas las columnas" },
        { value: "tipo_id", label: "ID" },
        { value: "tipo_nombre", label: "Nombre del Tipo de Ajuste" },
    ];

    const filteredTipoAjuste = tipoAjuste.filter((tipo) => {
        if (searchColumn === "") {
            return Object.values(tipo).some((field) =>
                field.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else {
            const fieldValue = tipo[searchColumn]?.toString().toLowerCase();
            return fieldValue?.includes(searchTerm.toLowerCase());
        }
    });

    const [currentPage, setCurrentPage] = useState(1);
    const tiposPerPage = 10;

    const indexOfLastTipo = currentPage * tiposPerPage;
    const indexOfFirstTipo = indexOfLastTipo - tiposPerPage;
    const currentTipos = filteredTipoAjuste.slice(indexOfFirstTipo, indexOfLastTipo);

    useEffect(() => {
        getTipoAjustes();
    }, []);

    const getTipoAjustes = async () => {
        try {
            const response = await AxiosProducto('/tipoAjustes', null, 'get');
            setTipoAjuste(response);
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSearchTerm("");
    };

    const openModal = (op, tipo_id, tipo_nombre) => {
        setTipoId(tipo_id || '');
        setTipoNombre(tipo_nombre || '');
        setOperation(op);
        setModalOpen(true);
        setTitle(op === 1 ? 'Registrar Tipo de Ajuste' : 'Actualizar Tipo de Ajuste');
    };

    const closeModal = () => {
        setModalOpen(false);
        getTipoAjustes();
    };

    const validar = async () => {
        if (!tipo_nombre.trim()) {
            Swal.fire('Atención', 'Escribe el nombre del tipo de ajuste', 'warning');
            return;
        }

        const metodo = operation === 1 ? 'post' : 'put';
        const urlOperacion = operation === 1 ? '/createTipoAjuste' : `/updateTipoAjuste/${tipo_id}`;

        await enviarSolicitud(metodo, urlOperacion, { tipo_id, tipo_nombre });
    };

    const enviarSolicitud = async (metodo, urlOperacion, parametros) => {
        try {
            const response = await AxiosProducto(urlOperacion, null, metodo, parametros);
            Swal.fire('Guardado', 'La operación se ha realizado con éxito', 'success');
            closeModal();
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };
    return (
        <div className="App">
          <div className="mx-auto px-3">
            {/* Resto de la interfaz */}
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
                    placeholder="Buscar tipo de ajuste..."
                    className="p-2 border-2 border-gray-200 rounded-md w-1/2"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <button onClick={() => openModal(1)} className="bg-dark-purple text-white p-3 rounded">
                    <i className="fa-solid fa-circle-plus"></i> Añadir
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:w-full p-3">
              {/* Tabla de tipos de ajuste */}
              <table className="w-full border-collapse divide-y divide-x divide-gray-500 text-center">
                <thead className="bg-dark-purple text-white">
                  <tr>
                    <th className="px-4 py-2 text-center text-sm">OPCIONES</th>
                    <th className="px-4 py-2 text-center text-sm">ID</th>
                    <th className="px-4 py-2 text-center text-sm">TIPO DE AJUSTE</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-300">
                  {currentTipos.map((tipo, index) => (
                    <tr key={tipo.tipo_id} className={`bg-white ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => openModal(2, tipo.tipo_id, tipo.tipo_nombre)}
                          className="bg-dark-purple p-2 rounded-full mx-1"
                        >
                          <i className="fa-solid fa-edit text-white"></i>
                        </button>
                      </td>
                      <td className="px-4 py-4">{tipo.tipo_id}</td>
                      <td className="px-4 py-4">{tipo.tipo_nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            {/* Resto de la interfaz */}
          </div>
          {/* Modal para añadir o editar un tipo de ajuste */}
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
                  <div className="mb-3">
                    <label htmlFor="tipo_nombre" className="text-sm">Nombre del Tipo de Ajuste:</label>
                    <input
                      type="text"
                      id="tipo_nombre"
                      className="border border-gray-200 rounded px-3 py-2 w-full"
                      placeholder="Nombre"
                      value={tipo_nombre}
                      onChange={(e) => setTipoNombre(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center mt-8">
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
export default AdminTipoAjuste;      