import React from 'react';

import imgSrc from '../assets/img/nuree1_1.png'; // Ruta de tu imagen

const Home = () => {

    return (

        <div style={containerStyles}>

            <img src={imgSrc} alt="Imagen Centralizada" style={imageStyles} />

        </div>

    );

}

// Estilos CSS personalizados para el contenedor

const containerStyles = {

    display: 'flex',

    justifyContent: 'center',

    alignItems: 'center',

    height: '100vh',

};

// Estilos CSS personalizados para la imagen

const imageStyles = {

    maxWidth: '100%',

    maxHeight: '100%',

};

export default Home;