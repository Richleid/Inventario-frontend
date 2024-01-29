import React, { useState } from 'react';
import imgSrc from '../assets/img/imgMenu'
import { Link } from 'react-router-dom'

// Revisar PROPS para pasar el estado de OPEN aqui desde App.js tal vez ese sea el error
const OptionsNavBar = () => {
    const OptionsNavBar = [
        { title: "Administracion de Productos", src: "Chart_fill", href: "/AdminProduct" },
        { title: "Inbox", src: "Chat", href: "/" },
        { title: "Accounts", src: "User", href: "/" },
        { title: "Schedule", src: "Calendar", href: "/" },
        { title: "Search", src: "Search", href: "/" },
        { title: "Analytics", src: "Chart", href: "/" },
        { title: "Archivos", src: "Folder", href: "/" },
    ]
    const [open, setOpen] = useState(true)
    return (
        <ul className={`${open ? "p-10 pt-5" : "p-0 pt-5"} duration-300`}>
            {OptionsNavBar.map((menu, index) => (
                <li key={index} className={`${menu.gap ? "mt-9" : "mt-2"} text-gray-300 text-sm flex items-center align-middle
  gap-x-4 cursor-pointer p-2`}>
                    <img src={imgSrc[menu.src]} alt='' />
                    <Link to={menu.href} className={`${!open && 'hidden'} origin-left duration-300`}>{menu.title}</Link>
                </li>
            ))}
        </ul>
    )
}

export default OptionsNavBar