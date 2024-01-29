import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import imageData from '../assets/img/nuree1_1.png';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'table',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderBottomColor: '#000000',
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    fontSize: 12,
    borderRightColor: '#000000',
    padding: 3,
    textAlign: 'center',
  },
  tableHeader: {
    flex: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderRightColor: '#000000',
    padding: 3,
    fontSize: 13,
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 90,
    height: 100,
    marginBottom: 30,
  },
});

const PDFButtonKardex = ({ datosProductoBuscado, currentData }) => {
  const generatePDF = () => {
    const doc = (
      <Document>
        <Page style={styles.page} size="A4" orientation="landscape">
          <View style={styles.section}>
            <Image style={styles.image} src={imageData} />
            <Text style={{ fontSize: 14, marginBottom: 10 }}>Cod. Prod: {datosProductoBuscado.codProd}</Text>
            <Text style={{ fontSize: 14 }}>Producto: {datosProductoBuscado.nombreProd}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableHeader,/* { backgroundColor: '#DDD' }*/]}>
                  <Text>Fecha</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Documento</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Descripción</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Cantidad</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>Stock</Text>
                </View>
              </View>
              {currentData.map((valor) => (
                <View style={styles.tableRow} key={valor.id}>
                  <View style={styles.tableCell}>
                    <Text>{valor.fecha}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{valor.numeroDocumento}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{valor.descripcion}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{valor.cantidad}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{valor.stock}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );

    const blob = new Blob([doc], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    return (
      <PDFDownloadLink document={doc} fileName="kardex.pdf">
        {({ blob, url, loading, error }) => (
          <button disabled={loading}>{loading ? 'Cargando documento...' : 'Descargar PDF'}</button>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <div>
      <button className="bg-blue-500 text-white rounded-md p-2 mt-2">
        {generatePDF()}
      </button>
    </div>
  );
};

export default PDFButtonKardex;
