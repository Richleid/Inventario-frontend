import React, { useState, useEffect, useRef } from 'react';
import { PDFDownloadLink, Document, Page, View, StyleSheet, Text, Image } from '@react-pdf/renderer';
import imageData from '../assets/img/nuree1_1.png';
import imagen from "../assets/img/pdf.png";
import Axios from 'axios';

const BASE_URL = 'https://inventarioproductos.onrender.com'; // Reemplaza esto con la URL base de tu API

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 10,
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableHeader: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    padding: 3,
    fontSize: 13,
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    fontSize: 12,
    borderRightColor: '#000000',
    padding: 3,
    textAlign: 'center',
  },
  image: {
    width: 90,
    height: 100,
    marginBottom: 30,
  },
});

const PDFButtonAjuste = ({ ajuste }) => {
  const [detallesModificados, setDetallesModificados] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const buttonClicked = useRef(false);

  useEffect(() => {
    const detallesModificables = ajuste.detalles.filter((detalle) => detalle.aju_det_modificable);
    const canPrintPDF = detallesModificables.length > 0;
    setDetallesModificados(canPrintPDF);

    if (!canPrintPDF && pdfGenerated === false) {
      setPdfGenerated(true);
    }
  }, [ajuste, pdfGenerated]);

  const handlePDFPrint = async () => {
    if (buttonClicked.current) {
      alert("Solo se puede generar el PDF una vez. No se puede imprimir de nuevo.");
      return;
    }

    if (detallesModificados) {
      const ajusteWithUpdatedDetalles = markDetallesAsPrinted(ajuste);

      try {
        await Axios.put(`${BASE_URL}/updateAjusteDetalles/${ajuste.aju_numero}`, ajusteWithUpdatedDetalles);
        console.log("Detalles actualizados correctamente en la base de datos.");

        setDetallesModificados(true);
        setPdfGenerated(true);
        buttonClicked.current = true;

        // Refrescar la página después de generar el PDF
        window.location.reload();
      } catch (error) {
        console.log("Error al actualizar detalles en la base de datos:", error.message);
      }
    }
  };

  const markDetallesAsPrinted = (ajuste) => {
    const detallesUpdated = ajuste.detalles.map((detalle) => ({
      ...detalle,
      aju_det_modificable: false,
    }));

    return {
      ...ajuste,
      detalles: detallesUpdated,
    };
  };

  const MyDocument = () => {
    if (!ajuste) {
      return null; // Devuelve un componente vacío si ajuste o detalles es undefined
    }

    return (
      <Document>
        <Page style={styles.page} size="A4">
          <View style={styles.section}>
            <Image style={styles.image} src={imageData} />
            <View style={styles.subtitle}>
              <Text>Reporte de Ajuste</Text>
            </View>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>Numero de Ajuste: {ajuste.aju_numero}</Text>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>Fecha: {ajuste.aju_fecha}</Text>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>Descripción: {ajuste.aju_descripcion}</Text>
            <Text style={{ fontSize: 14, marginBottom: 10 }}>Ajuste:  {ajuste.aju_estado ? 'Activo' : 'Inactivo'}</Text>
            <View style={styles.subtitle}>
              <Text>Detalles del Ajuste</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableHeader}>
                  <Text>ID</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Producto</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Cantidad</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Estado</Text>
                </View>
              </View>
              {ajuste.detalles.map((detalle) => (
                <View style={styles.tableRow} key={detalle.aju_det_id}>
                  <View style={styles.tableCell}>
                    <Text>{detalle.aju_det_id}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{detalle.producto.pro_nombre}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{detalle.aju_det_cantidad}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{detalle.aju_det_estado ? 'Activo' : 'Inactivo'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <>
      {/* Reemplazar canPrintPDF por detallesModificados */}
      {detallesModificados && (
        <PDFDownloadLink document={<MyDocument ajuste={ajuste} />} fileName="reporte_ajuste.pdf">
          {({ url }) => {
            if (url) {
              return (
                <a href={url} download="reporte_ajuste.pdf" target="_blank" rel="noopener noreferrer" onClick={handlePDFPrint}>
                  <img src={imagen} alt="Imagen" style={{ maxWidth: '35px', maxHeight: '35px' }} />
                </a>
              );
            } else {
              return null;
            }
          }}
        </PDFDownloadLink>
      )}
    </>
  );
};

export default PDFButtonAjuste;
