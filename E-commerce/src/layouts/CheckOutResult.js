import React from "react";
import { useLocation } from 'react-router-dom';

function CheckOutResult(){
    const email = localStorage.getItem("email");
    const cartId = localStorage .getItem("cartId");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const vnpTransactionStatus = queryParams.get('vnp_TransactionStatus');
    const vnpBankTranNo = queryParams.get('vnp_BankTranNo');



}