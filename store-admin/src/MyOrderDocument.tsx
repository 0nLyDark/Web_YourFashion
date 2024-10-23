import React, { Fragment } from 'react'
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
import logo from './img/logo.png'
import { Font } from '@react-pdf/renderer';
import RobotoRegular from '../public/fonts/Roboto-Regular.ttf'; // Đường dẫn đến file font Roboto
import RobotoBold from '../public/fonts/Roboto-Bold.ttf'; // Đường dẫn đến file font Roboto
import RobotoItalic from '../public/fonts/Roboto-Italic.ttf'; // Đường dẫn đến file font Roboto
function formatNumber(number: { toLocaleString: (arg0: string) => any; }) {
    const formattedNumber = number.toLocaleString('vi-VN'); // Định dạng theo tiếng Việt
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function formatDate(date: { split: (arg0: string) => [any, any, any]; }) {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
}
// Đăng ký font Roboto hỗ trợ tiếng Việt
Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: RobotoRegular,
        fontWeight: 400, // Trọng số mặc định
      },
      {
        src: RobotoBold,
        fontWeight: 700, // Trọng số bold
        fontStyle: 'bold',
      },
      {
        src: RobotoItalic,
        fontWeight: 400, // Trọng số normal
        fontStyle: 'italic',
      },
    ],
  });

const MyOrderDocument = ({ data }) => {
    const { orderId, deliveryName,address, totalAmount, orderDate, orderStatus ,orderItems, payment} = data;
    
    const styles = StyleSheet.create({
    page: {fontFamily:'Roboto', fontSize: 11,paddingTop: 20,paddingLeft: 40,paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },
    spaceBetween : {flex : 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },
    spaceCenter : {flex : 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: "#3E3E3E" },

    titleContainer: {flexDirection: 'row', marginTop: 20},
    
    logo: { width: 200 },
    
    reportTitle: { fontSize: 16, textAlign: 'center' },
    
    addressTitle : {fontSize: 15, fontWeight: 'bold'},
    
    invoice : {fontWeight: 'bold', fontSize: 20},
    
    invoiceNumber : {fontSize: 11, fontWeight: 'bold'},
    
    address : { fontWeight: 400, fontSize: 13},
    theader : {marginTop : 20, fontSize : 12, fontStyle: 'bold', paddingTop: 4 ,paddingLeft: 7, textAlign:'center'
        , flex:1, height: 24, backgroundColor : '#DEDEDE', borderColor : 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1},
        
    theader2 : { flex:2, borderRightWidth:0, borderBottomWidth:1},
        
    tbody: { fontSize : 10, paddingTop: 6 , paddingLeft: 7 , flex:1, borderColor : 'whitesmoke', borderRightWidth:1,
        borderBottomWidth:1, textAlign:"right", paddingRight:10},
        
    total:{ fontSize : 9, paddingTop: 4 , paddingLeft: 7, flex:1.5, borderColor : 'whitesmoke', borderBottomWidth:1, textAlign:"right", paddingRight:10},
        
    tbody2:{ flex:2, borderRightWidth:1, paddingRight: 7 }
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
                    <Text style={{fontSize: 22}} >Hóa Đơn Mua Hàng</Text>
                </View>
            </View>
    )
        
    const UserAddress = () => (
        <View style={{ width:"100%"}}>
            <View style={[styles.titleContainer]} >
                <View style={styles.spaceBetween}>
                    <View style={{ maxWidth: 450 }}>
                        <Text style={styles.addressTitle}>Mã đơn: <Text style={styles.address}>{orderId }</Text></Text>
                        <Text style={styles.addressTitle}>Người nhận: <Text style={styles.address}>{deliveryName }</Text></Text>
                        <Text style={styles.addressTitle}>Ngày đặt: <Text style={styles.address}>{ formatDate(orderDate) }</Text></Text>
                        <Text style={styles.addressTitle}>Địa chỉ: <Text style={styles.address}>{`${address.buildingName}, ${address.ward}, ${address.district}, ${address.city}` }</Text></Text>
                        <Text style={styles.addressTitle}>Tổng tiền: <Text style={styles.address}>{formatNumber(totalAmount)} VNĐ</Text></Text>
                        <Text style={styles.addressTitle}>Thanh toán: <Text style={styles.address}>{payment.paymentMethod }</Text></Text>
                    </View>
                </View>
            </View>
        </View>
        
    );
    const TableHead = () => (
            <View style={{ width: '100%', flexDirection: 'row', marginTop: 18 }}>
                <View style={[styles.theader, styles.theader2]}>
                    <Text>Sản phẩm</Text>
                </View>
                <View style={styles.theader}>
                    <Text>Đơn Giá</Text>
                </View>
                <View style={styles.theader}>
                    <Text>Số lượng</Text>
                </View>
                {/* <View style={styles.theader}>
                    <Text>Dicount</Text>
                </View> */}
                <View style={styles.theader}>
                    <Text>Thành tiền</Text>
                </View>
            </View>
            
    );

    const TableBody = () => (
        
        orderItems.map((orderItem) => (
        <View style={{ width: '100%', flexDirection: 'row' }} key={orderItem.orderItemId}>
            <View style={[styles.tbody, styles. tbody2]}>
                <Text style={{ textAlign:"left" }} >{orderItem.product.productName}</Text>
            </View>
            <View style={styles.tbody}>
                <Text>{formatNumber(orderItem.orderedProductPrice)}</Text>
            </View>
            <View style={styles.tbody}>
                <Text>{orderItem.quantity}</Text>
            </View>
            {/* <View style={styles.tbody}>
            <Text>{product.discount}%</Text>
            </View> */}
            <View style={styles. tbody}>
                <Text>{formatNumber(orderItem.orderedProductPrice * orderItem.quantity)}</Text>
            </View>
        </View>
        ))
    );

    const TableTotal = () => (
        <View style={{ width: '100%', flexDirection: 'row' }}>
        <View style={styles.total}>
        <Text></Text>
        </View>
        <View style={styles.total}>
        <Text></Text>

        </View>
        <View style={styles.tbody}>
        <Text>Tổng tiền</Text>
        </View>
        <View style={styles.tbody}>
        <Text>{formatNumber(totalAmount)}</Text>
        </View>
        </View>
        
    );
    const SignPage=()=>(
        <View style={{ textAlign:"right",marginTop:10,marginRight:25,fontStyle:'bold' }} >
            <Text>Ký tên và đóng dấu</Text>
        </View>
    )
    return (
        <Document>
            <Page size="A4" style={styles.page} >
                <InvoiceTitle />
                <TitlePage />
                <UserAddress />
                <TableHead />
                <TableBody />
                <TableTotal />
                <SignPage />
            </Page>
        </Document>
        
    );
            
}

export default MyOrderDocument;