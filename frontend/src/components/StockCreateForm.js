import React, { useState } from "react";
import axios from 'axios';

// Import CSS file
import './StockCreateForm.css';

const StockCreateForm = () => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [currentstocklevel, setCurrentStockLevel] = useState('');
    const [minstocklevel, setMinStockLevel] = useState('');

    const sendData = async (e) => {
        e.preventDefault();

        try {
            const newStockData = {
                itemName: itemName,
                quantity: quantity,
                currentstocklevel: currentstocklevel,
                minstocklevel: minstocklevel,
            };

            const response = await axios.post('http://localhost:8000/stock/create', newStockData);
            console.log(response.data);

            alert(response.data.message);

            // Clear form fields after successful submission
            setItemName('');
            setQuantity('');
            setCurrentStockLevel('');
            setMinStockLevel('');
        } catch (error) {
            console.error("💀 :: Error sending data:", error.message);
            
        }
    };
    
    return (
        <div className="stockcreateFormContainer">
            <div className="formBootstrap">
            <h2 className="mb-4">Create Form</h2>

                <form onSubmit={sendData}>
                    <div className="form-group mb-3">
                        <label For="itemName">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="itemName"
                            placeholder="Name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label For="quantity">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label For="currentStockLevel">Current Stock Level</label>
                        <input
                            type="number"
                            className="form-control"
                            id="currentStockLevel"
                            placeholder="Current Stock Level"
                            value={currentstocklevel}
                            onChange={(e) => setCurrentStockLevel(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label For="minStockLevel">Minimum Stock Level</label>
                        <input
                            type="number"
                            className="form-control"
                            id="minStockLevel"
                            placeholder="Minimum Stock Level"
                            value={minstocklevel}
                            onChange={(e) => setMinStockLevel(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            
           
            
        </div>
        
        </div>
    );
};

export default StockCreateForm;