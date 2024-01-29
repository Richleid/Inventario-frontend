import React, { useState } from 'react'
import imgSrc from './assets/img/imgMenu'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import RoutPages from './routes/Routes'
import HeaderPage from './components/Header'


function App() {
  const OptionsNavBar = [
    { title: "Administracion de Productos", src: "Folder", href: "/AdminProduct" },
    { title: "Administracion de Categorias", src: "Folder", href: "/Categoria" },
    { title: "Administracion de Ajustes", src: "Setting", href: "/AdminAjuste" },
    { title: "Administracion de Ajustes", src: "Setting", href: "/AdminAjustes" },
    { title: "Administracion de Ventas", src: "Search", href: "/AdminVentas" },
    { title: "Administración de Clientes", src: "User", href: "/AdminClientes" },
    { title: "Administración de Tipos de ajuste", src: "Setting", href: "/AdminTipoAjuste" },
  ]
  const [open, setOpen] = useState(true)
  return (
    <Router>
      <div className="flex">
        <div className={`${open ? "w-80" : "w-20"} duration-300 pl-2 h-screen gap-4 bg-dark-purple
     relative`}>
          <img src={imgSrc['control']} alt=''
            className={`${!open && "rotate-180"} absolute cursor-pointer rounded-full -right-3
       top-14 w-7 border-2 border-dark-purple`}
            onClick={() => setOpen(!open)}
          />
          <div className='flex gap-x-4 mt-4 items-center'>
            <img src={imgSrc['logo192']} alt='Logo-React'
              className='w-16 cursor-pointer duration-500'
            />
            <h1 className={`${!open && "hidden"}  text-white p-0 origin-left font-semibold text-x1 duration-200`}>
              Inventario Productos
            </h1>
          </div>
          <ul className={`${open ? "p-10 pt-5" : "p-0 pt-5"} duration-500`}>
            {OptionsNavBar.map((menu, index) => (
              <li key={index} className={`${menu.gap ? "mt-9" : "mt-2"} text-gray-300 text-sm flex items-center align-middle
        gap-x-4 cursor-pointer p-2 rounded-md mr-0 hover:bg-blue-500 duration-300`}  onClick={() => 'bg-blue-500'}>
                <Link to={menu.href} className={`origin-left duration-300 flex items-center align-middle gap-x-4`}>
                  <img src={imgSrc[menu.src]} alt='' />
                  <h1 className={`${!open && 'hidden'}`}>{menu.title}</h1>
                </Link>
              </li>
            ))}
          </ul>
          <div className='flex gap-x-4 items-center mt-10 cursor-pointer'>
            <img src={imgSrc['Setting']} className={`w-6 ml-2`} alt='img-setting' />
            <h1 className={`${!open && "hidden m-14"} text-white font-semibold origin-left textx1 duration-300`}>Settings</h1>
          </div>
        </div>
        <div className='flex flex-col p-0 w-full'>
          <HeaderPage />
          <div className={`${open ? "mr-14 ml-14 pr-0" : "ml-12 pr-1 pl-0"} p-2 pr-36 text-2x1 font-semibold 
          relative flex justify-center m-0 duration-300`}>
            <RoutPages />
          </div>
        </div>
      </div>
    </Router>
  )
}

function renderApp() {
  return (
    <div>
      {App()}
    </div>
  )

}
export default renderApp
