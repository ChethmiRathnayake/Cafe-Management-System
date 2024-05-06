import React, { useEffect,useState } from "react";
import axios from "axios";
import './Payment.css';
import { useNavigate, useParams } from "react-router-dom";

const PaymentCreateForm = () => {

    const [promotions, setPromotions] = useState([]);
    const [orderID, setorderID] = useState('');
    const [promotionID, setpromotionID] = useState('ehjd');
    const [amount, setamount] = useState('');
    const [date, setdate] = useState('');

    const [total, setTotal] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState(0); 
    const [payableAmount, setPayableAmount] = useState(0);
    // const [order,setOrder] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState("");

    const [orderItem,setorderItem] = useState([]);
    const[orderPrice,setorderPrice] = useState();

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getOneOrder = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/order/oneOrder/${id}`);
                setorderPrice(res.data.order.OrderPrice);
                setorderItem(res.data.order.menuItems);
                setorderID(res.data.order._id);

                console.log("Order",res.data.order);

                const data = res.data.order;
                let totalPrice = 0;
                // Iterate through each order and add its price to totalPrice
                // data.forEach(order => {
                //     totalPrice += order.OrderPrice;
                // });

                totalPrice = data.OrderPrice;

                setTotal(totalPrice);
                setPayableAmount(totalPrice);

                console.log("Total price : ",total);
            } catch (err) {
                console.log("Error fetching last document:", err.message);
            }
        }
        getOneOrder();
    }, [id]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await axios.get('http://localhost:8000/promotion/promotions');
                setPromotions(res.data.Allpromotions);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            }
        };
    
        fetchPromotions();
    }, []);
    

    const handleChange = (event) => {
        const { value } = event.target;
        setPaymentAmount(value);
    };


    const calculateChange = () => {
        let change;
        if(paymentAmount === 0){
            change = 0;
        }else{
            change = paymentAmount - payableAmount;
        }
       
        return change;
    };

    const handlePromotionChange = (event) => {
        setSelectedPromotion(event.target.value);
        
        // Retrieve the selected promotion object from the promotions array
        const selectedPromotion = promotions.find(promotion => promotion._id === event.target.value);
    
        if (selectedPromotion) {
            // Calculate the discount amount based on the promotionValues (assumed to be percentage)
            const discountPercentage = selectedPromotion.promotionValues;
            const discountAmount = (total * discountPercentage) / 100;
            
            // Subtract the discount amount from the total to get the new total price
            const newTotalPrice = total - discountAmount;
    
            // Update the payable amount with the new total price
            setPayableAmount(newTotalPrice);
        } else {
            // If the selected promotion is not found, reset the payable amount to the original total
            setPayableAmount(total);
        }
    };
    

    const sendData = async(e) => {
        e.preventDefault();

        try{

            let newPaymentData = {
                orderID: orderID,
                promotionID: selectedPromotion,
                amount: payableAmount,
            }

            console.log("OrderID : ",orderID)
            console.log("promotionID : ",promotionID)
            console.log("amount : ",amount)

            axios.post('http://localhost:8000/payment/create',newPaymentData)
            .then((res) => {
                alert(res.data.message);
                console.log(res.data.status);
                console.log(res.data.message);
                navigate('/ordercreate');
            })
            .catch((err) => {
                console.log("💀 :: Error on API URL or newPaymentData object : "+err.message);
            })
                                                                      
        }catch(err){
            console.log("💀 :: sendData function failed! ERROR : "+err.message);
        }
    }

  return (
    <div className="PaymentContainer">

        <div className="PaymentWidthBlanceDiv">

            <div className="paymentTableContainer">
                <div className="orderIdDiv">
                    <p>OrderID: {orderID}</p>
                </div>

                <div className="paymentTableWrapper">
                    <table class="paymentTable">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Order Items</th>
                                {/* <th scope="col">Quantity</th> */}
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            
                                <tr>
                                    <th scope="row">1</th>
                                    <td>
                                        <ul>
                                        
                                            {orderItem.map(item => (
                                                <li key={item._id}>
                                                {item.menuItemName} - {item.menuItemPrice ? item.menuItemPrice.toFixed(2) : 'N/A'}LKR
                                                </li>
                                            ))}
                                            
                                        </ul>
                                    </td>
                                    {/* <td>{order.OrderQuantity}</td> */}
                                    <td>{orderPrice}</td>
                                </tr>
                            
                                
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="paymentSideView">
                <div className="calculationPhase">
                    <div className="paymentTotalPhase">
                        <p>Total: <span>{total} LKR</span></p>
                    </div>
                    <div className="paymentPropotionPhase">
                        <p>Add Promotion: </p>
                        <select name="promotion" id="promotion" value={selectedPromotion} onChange={handlePromotionChange}>
                            {promotions.map(promotion => (
                                <option key={promotion._id} value={promotion._id}>{promotion.promotionName}</option>
                            ))}
                             {console.log("Promotions:", promotions)}
                        </select>

                    </div>
                    <div className="paymentPayableAmountPhase">
                        <p>Payable Amount: <h3>{payableAmount} LKR</h3></p>
                    </div>
                </div>
                <div className="balancePhase">
                    <div className="paymentAmountDiv">
                        <label for="paymentAmount">Payment Amount(LKR):</label>
                        <input type="text" id="paymentAmount" name="paymentAmount" value={paymentAmount} onChange={handleChange} placeholder="Enter amount tendered" />
                    </div>
                    <div className="changeDiv">
                        <p>Change: <h3>{calculateChange()} LKR</h3></p>
                    </div>
                    <div className="PaymentButtonDiv">
                        <button class="custom-button" onClick={sendData}>Done</button>
                    </div>
                </div>
            </div>

        </div>

    </div>
  )
};

export default PaymentCreateForm;
