import { BlobProvider } from '@react-pdf/renderer';
import MyDocument from './MyDocument';
import { HiOutlinePrinter } from 'react-icons/hi'
import React, { useEffect, useState } from 'react';
import { url } from 'inspector';
import MyOrderDocument from './MyOrderDocument';

const PDFButton = ({ id, email,source }: { id: string; email: string; source:string }) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        
        const fetchData = async () => {

            const token = localStorage.getItem('jwt-token');
            if (!id) {
                setError(new Error('No cart ID found in localStorage'));
                setLoading(false);
                return;
            }
            if (!token) {
                // setError(new Error('No token found in localStorage'));
                setError(new Error('No token found in localStorage'));
                setLoading(false);
                return;
            }
            
            try {
                let url = `http://localhost:8080/api/public/users/${email}/${source}/${id}`;
                const response = await fetch(url , {
                    headers: {
                    'Authorization': `Bearer ${token}` , // Include token in the Authorization header
                    'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error);
                } else {
                    setError(new Error('An unknown error occurred'));
                }            
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id,email]);
    useEffect(()=>{
        console.log(data);
    },[data])
    if (loading) return <div>Loading ...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const styles:{ btn: React.CSSProperties; hover: React.CSSProperties } = {
        
    btn: {
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 10px',
        fontSize: '12px',
        color: '#ffd700',
        fontWeight: 700,
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: '#ffd70000',
        textDecoration: 'none',
        transition: 'background-color 0.3s, color 0.3s',
    },
    hover: {
        backgroundColor: '#ffd70010'
    }
    }
    const handleMouseEnter = (e :React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.backgroundColor = styles. hover. backgroundColor??'';
        e.currentTarget.style.color = styles.hover.backgroundColor??'';

    };

    const handleMouseLeave = (e :React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget. style.backgroundColor = styles.btn. backgroundColor??'';
        e. currentTarget. style. color = styles.btn. color??'';
    };

return (
    <BlobProvider document={source === "carts"?<MyDocument data={data}/>:<MyOrderDocument data={data}/>}>
        {({ url, blob }) => (
        <a
            href={url??""}
            target="_blank"
            style={styles.btn}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <HiOutlinePrinter size={17} />
            <span style={{textDecoration: 'none' } }>PRINT</span>
        </a>
        )}
    </BlobProvider>
    )
}

export default PDFButton;