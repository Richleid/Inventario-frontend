import React from 'react';
import { PDFDownloadLink, Document, Page, View, StyleSheet, Text, Image } from '@react-pdf/renderer';

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
  },
});


const PDFButton = ({ data }) => {
  const MyDocument = () => (
    <Document>
      {data.reduce((pages, producto, index) => {
        if (index % 9 === 0) {
          const pageData = data.slice(index, index + 9);
          pages.push(
            <Page key={index} style={styles.page} size="A4" orientation="landscape">
              <View>
                <View>
                  <View>
                    <Image style={styles.image} src={require('../assets/img/nuree1_1.png')} />
                  </View>
                  <View style={styles.subtitle}>
                    <Text>Reporte de Productos</Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableHeader}>
                      <Text>ID</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>PRODUCTO</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>DESCRIPCIÓN</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>CATEGORÍA</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>IVA</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>COSTO</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>PVP</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>ESTADO</Text>
                    </View>
                    <View style={styles.tableHeader}>
                      <Text>STOCK</Text>
                    </View>
                  </View>
                  {pageData.map((producto) => (
                    <View style={styles.tableRow} key={producto.pro_id}>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_id}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_nombre}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_descripcion}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.cat_nombre}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_valor_iva? "12%" : "0%"}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_costo}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_pvp}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_estado ? "Inactivo" : "Activo"}</Text>
                      </View>
                      <View style={styles.tableCell}>
                        <Text>{producto.pro_stock}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </Page>
          );
        }
        return pages;
      }, [])}
    </Document>
  );

  return (
    <PDFDownloadLink document={<MyDocument />} fileName="productos.pdf">
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

      </View>
      <button className="bg-dark-purple text-white p-3 rounded">
        Imprimir
      </button>
    </PDFDownloadLink>
  );
};

export default PDFButton;