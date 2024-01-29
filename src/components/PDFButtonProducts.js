import React from 'react';
import { PDFDownloadLink, Document, Page, View, StyleSheet, Text, Image } from '@react-pdf/renderer';
import imagen from "../assets/img/pdf.png";

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

const PDFButtonProducts = ({ selectedProduct, setSelectedProductId }) => {
    const MyDocument = () => {
        if (!selectedProduct) {
            return null; // Devuelve un componente vacío si selectedProduct es undefined
        }

        return (
            <Document>
                <Page style={styles.page} size="A4" orientation="landscape">
                    <View>
                        <View>
                            <View>
                                <Image style={styles.image} src={require('../assets/img/nuree1_1.png')} />
                            </View>
                            <View style={styles.subtitle}>
                                <Text>Reporte de Producto</Text>
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
                            <View style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_id}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_nombre}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_descripcion}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.cat_nombre}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_valor_iva ? "12%" : "0%"}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_costo}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_pvp}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_estado ? 'Inactivo' : 'Activo'}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{selectedProduct.pro_stock}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    };

    return (
        <PDFDownloadLink document={<MyDocument selectedProduct={selectedProduct} />}>
            {({ url }) => {
                if (url) {
                    return (
                        <a href={url} download="producto.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setSelectedProductId(null)}>
                            <img src={imagen} alt="Imagen" style={{ maxWidth: '35px', maxHeight: '35px' }} />
                        </a>
                    );
                } else {
                    return null;
                }
            }}
        </PDFDownloadLink>
    );
};
export default PDFButtonProducts;