import { useState, useEffect } from 'react';
import API_BASE_URL from '../config.js';
import { Modal} from 'react-bootstrap';

const Transactions = () => {

    // get Categories to display
    const [transactionHistory, setTransactionHistory] = useState([]);

    // set loading...
    const [loading, setLoading] = useState(true);

    // handle individual variables
    const [productDetails, setProductDetails] = useState([]);

    // Modal state
    const [showModal, setShowModal] = useState(false);

    // Show Modal
    const makeShowModalAppear = () => setShowModal(!showModal);

    // handle individual variables
    const [totalPayment, setTotalPayment] = useState(0);
    const [transactionDate, setTransactionDate] = useState('');

    // Fetch all transaction history
    const getTransactionHistory = async () => {
        const response = await fetch(
            API_BASE_URL +
            "/api/TransactionHistoryApi/GetAllTransactionHistory"
        );

        const result = await response.json();
        setTransactionHistory(result);
        setLoading(false);
    }

    // Fetch specific transaction history's details
    const getTransactionDetails = async (id) => {
        const response = await fetch(
            API_BASE_URL +
            "/api/TransactionProductApi/GetTransactionProducts?transactionId=" + id,
        );

        const result = await response.json();
        setProductDetails(result);
        setShowModal(true);
        setLoading(false);
    }

    // set summary of transaction in modal
    const setSummary = (totalPayment, transactionDate) =>{
        setTotalPayment(totalPayment);
        setTransactionDate(transactionDate);
    }

    // update browser in case of database updates
    useEffect(() => {
        getTransactionHistory();
    }, []);

    // if the browser is still loading data
    if (loading) return <center><h1>Loading</h1></center>

    return (
        <>
            {/* Display All Transaction History Data */}
            <div className="crud-content-container">
                <br></br>
                <div className="table-container">
                    <div className="fixTableHead Narrow">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>TransactionDate</th>
                                    <th>TotalPayment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionHistory.map((th) =>
                                    <tr key={th.transactionId}>
                                        <td>{th.transactionId}</td>
                                        <td>{th.transactionDate}</td>
                                        <td>${th.totalAmount}</td>
                                        <td className='action-btn-container-display'>
                                            <button className="action-btn row-btn update-client-btn" onClick={() => {getTransactionDetails(th.transactionId), setSummary(th.totalAmount, th.transactionDate)}}>View</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal to display product details */}
            <Modal show={showModal} onHide={makeShowModalAppear}>
                <Modal.Header closeButton>
                    <b className='bold-color'>Transaction Details</b>
                </Modal.Header>
                <Modal.Body>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productDetails.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.productName}</td>
                                    <td>${product.price}</td>
                                    <td>{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Body>
                    <div className="footer-container">
                        <p> <b>Total: </b> ${totalPayment}</p>
                        <p> <b>Date: </b> {transactionDate}</p>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Transactions;
