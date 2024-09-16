import React, { Fragment } from 'react'
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
import logo from './img/LogoHITC.png'


const MyOrderDocument = ({ data }) => {
    const { orderId, email, totalAmount, orderDate, orderStatus ,orderItems, payment} = data;
    
    const styles = StyleSheet.create({
    page: {fontSize: 11,paddingTop: 20,paddingLeft: 40,paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },
    
    spaceBetween : {flex : 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },
    spaceCenter : {flex : 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: "#3E3E3E" },

    titleContainer: {flexDirection: 'row', marginTop: 24},
    
    logo: { width: 100 },
    
    reportTitle: { fontSize: 16, textAlign: 'center' },
    
    addressTitle : {fontSize: 15, fontStyle: 'bold'},
    
    invoice : {fontWeight: 'bold', fontSize: 20},
    
    invoiceNumber : {fontSize: 11, fontWeight: 'bold'},
    
    address : { fontWeight: 400, fontSize: 13},
    theader : {marginTop : 20, fontSize : 10, fontStyle: 'bold', paddingTop: 4 ,paddingLeft: 7
        , flex:1, height: 20, backgroundColor : '#DEDEDE', borderColor : 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1},
        
    theader2 : { flex:2, borderRightWidth:0, borderBottomWidth:1},
        
    tbody: { fontSize : 9, paddingTop: 4 , paddingLeft: 7 , flex:1, borderColor : 'whitesmoke', borderRightWidth:1,
        borderBottomWidth:1},
        
    total:{ fontSize : 9, paddingTop: 4 , paddingLeft: 7, flex:1.5, borderColor : 'whitesmoke', borderBottomWidth:1},
        
    tbody2:{ flex:2, borderRightWidth:1, }
    });

    const InvoiceTitle = () => (
            <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 , justifyContent: 'center' }}>
                <View style={styles.spaceCenter}>
                    <Image style={styles.logo} src={logo} />
                </View>
            </View>
    );
    const TitlePage = () =>(
            <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 , justifyContent: 'center' }}>
                <View style={styles.spaceCenter}>
                    <Text style={{ fontSize:"22px" }} >Hóa Don Mua Hàng</Text>
                </View>
            </View>
    )
        
    const UserAddress = () => (
        <View style={{ width:"100%"}}>
            <View style={[styles.titleContainer]} >
                <View style={styles.spaceBetween}>
                    <View style={{ maxWidth: 250 }}>
                        <Text style={styles.addressTitle}>Email: <Text style={styles.address}>{email }</Text></Text>
                        <Text style={styles.addressTitle}>Order Date: <Text style={styles.address}>{orderDate }</Text></Text>
                        <Text style={styles.addressTitle}>Total Amount: <Text style={styles.address}>{totalAmount.toFixed(2) } VND</Text></Text>
                        <Text style={styles.addressTitle}>Payment Method: <Text style={styles.address}>{payment.paymentMethod }</Text></Text>

                    </View>
                </View>
            </View>
        </View>
        
    );
    const TableHead = () => (
            <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
                <View style={[styles.theader, styles. theader2]}>
                    <Text>Items</Text>
                </View>
                <View style={styles.theader}>
                    <Text>Price</Text>
                </View>
                <View style={styles.theader}>
                    <Text>Qty</Text>
                </View>
                {/* <View style={styles.theader}>
                    <Text>Dicount</Text>
                </View> */}
                <View style={styles.theader}>
                    <Text>Amount</Text>
                </View>
            </View>
            
    );

    const TableBody = () => (
        
        orderItems.map((orderItem) => (
        <View style={{ width: '100%', flexDirection: 'row' }} key={orderItem.orderItemId}>
            <View style={[styles.tbody, styles. tbody2]}>
                <Text>{orderItem.product.productName}</Text>
            </View>
            <View style={styles.tbody}>
                <Text>{orderItem.orderedProductPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.tbody}>
                <Text>{orderItem.quantity}</Text>
            </View>
            {/* <View style={styles.tbody}>
            <Text>{product.discount}%</Text>
            </View> */}
            <View style={styles. tbody}>
                <Text>{(orderItem.orderedProductPrice * orderItem.quantity).toFixed(2)}</Text>
            </View>
        </View>
        ))
    );

    const TableTotal = () => (
        <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={styles. total}>
        <Text></Text>
        </View>
        <View style={styles. total}>
        <Text></Text>

        </View>
        <View style={styles. tbody}>
        <Text>Total</Text>
        </View>
        <View style={styles. tbody}>
        <Text>{totalAmount.toFixed(2)}</Text>
        </View>
        </View>
        
    );
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <InvoiceTitle />
                <TitlePage />
                <UserAddress />
                <TableHead />
                <TableBody />
                <TableTotal />
            </Page>
        </Document>
        
    );
            
}

export default MyOrderDocument;