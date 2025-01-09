import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const API_BASE_URL = "http://localhost:3001";

function App() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [productionQuantity, setProductionQuantity] = useState(1);
  const [error, setError] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [setProduction] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1); // Default to quantity 1
  const [newClient, setNewClient] = useState({
    Nume: "",
    Email: "",
    Telefon: "",
    Adresa: "",
    Tip_Client: "",
  });
  const [newProduct, setNewProduct] = useState({
    Denumire: "",
    Descriere: "",
    Dimensiuni: "",
    Tip_Produs: "",
    Cantitate_Stoc: 0,
    Pret_Unitar: 0,
    Status_Produs: "activ", // Default value
    Durata_Productie: null,
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchProducts();
    fetchOrders();
    fetchProduction();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients`);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data); // Make sure this is correctly populating `orders`
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProduction = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/production`);
      setProduction(response.data);
    } catch (error) {
      console.error("Error fetching production:", error);
    }
  };

  const handleCreateProduct = async () => {
    const productData = {
      Denumire: newProduct.Denumire,
      Pret_Unitar: newProduct.Pret_Unitar, // Ensure that this matches backend field name
      Cantitate_Stoc: newProduct.Cantitate_Stoc,
      Descriere: newProduct.Descriere,
      Dimensiuni: newProduct.Dimensiuni,
      Tip_Produs: newProduct.Tip_Produs,
      Durata_Productie: newProduct.Durata_Productie,
      Status_Produs: newProduct.Status_Produs,
    };

    try {
      const response = await axios.get(`${API_BASE_URL}/products`, productData);
      console.log("Product created successfully:", response.data);
      setIsProductModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error creating product:", error.response.data);
    }
  };

  const handleCreateClient = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/clients`, newClient);
      console.log("Client created:", response.data);
      fetchClients(); // Refresh clients list
      setIsClientModalOpen(false); // Close the modal
    } catch (error) {
      console.error(
        "Error creating client:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleCreateOrder = async () => {
    // Validate input: ensure a client, product, and quantity are selected
    if (!selectedClient) {
      alert("Please select a client.");
      return;
    }

    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (orderQuantity <= 0) {
      alert("Please specify a valid quantity.");
      return;
    }

    // Prepare the order details for the selected product
    const orderDetails = [
      {
        ID_Produs: selectedProduct.ID_Produs,
        Cantitate: orderQuantity,
      },
    ];

    // Send the order request to the backend
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        ID_Client: selectedClient.ID_Client,
        products: orderDetails,
      });

      console.log("Order created:", response.data);
      fetchOrders(); // Refresh orders list
      setIsModalOpen(false); // Close the modal after placing the order
      setSelectedClient(null); // Clear client selection
      setSelectedProduct(null); // Clear product selection
      setOrderQuantity(1); // Reset quantity to 1
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setProductionQuantity(value ? parseInt(value, 10) : 0);
  };

  const handleStartProduction = async () => {
    console.log("Selected Product:", selectedProduct);
    console.log("Production Quantity:", productionQuantity);

    // Validate product and quantity
    if (!selectedProduct || !productionQuantity || productionQuantity <= 0) {
      setError("Please select a valid product and specify a valid quantity.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/production`, {
        ID_Produs: selectedProduct.ID_Produs,
        quantity: productionQuantity,
      });

      setIsProductionModalOpen(false); // Close the modal
      console.log("Production started:", response.data);
      setError(""); // Clear any error if production is successful
    } catch (error) {
      console.error(
        "Error starting production:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

  const handleEditProduct = async () => {
    if (!selectedProductForEdit) return; // Ensure that there is a product to edit

    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/${selectedProductForEdit.ID_Produs}`,
        selectedProductForEdit // This should be the product object with the updated data
      );
      console.log("Product updated:", response.data);
      fetchProducts(); // Refresh the products list to show the updated data
      setIsProductEditModalOpen(false); // Close modal after updating
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/products/${productId}`
      );
      console.log("Product deleted:", response.data);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // const filteredOrders = orders.filter((order) =>
  //   filterType ? order.Tip && order.Tip.includes(filterType) : true
  // );

  // const filteredProducts = products.filter((product) =>
  //   filterType ? product.Tip && product.Tip.includes(filterType) : true
  // );

  const generateReport = () => {
    const totalOrders = orders.length;
    const activeProducts = products.filter(
      (product) => product.Status_Produs === "activ"
    ).length;
    const lowStockProducts = products.filter(
      (product) => product.Cantitate_Stoc <= 5
    ).length;

    return {
      totalOrders,
      activeProducts,
      lowStockProducts,
    };
  };

  const [reportData, setReportData] = useState(null);

  const handleViewReports = () => {
    const data = generateReport();
    setReportData(data);
    setIsReportModalOpen(true);
  };

  return (
    <div className="App">
      <header>
        <h1>PVC Management System</h1>
      </header>
      <button onClick={() => setIsClientModalOpen(true)}>Add Client</button>
      <button onClick={() => setIsModalOpen(true)}>Add Order</button>
      <button onClick={() => setIsProductionModalOpen(true)}>
        Start Production
      </button>
      <button onClick={() => setIsProductModalOpen(true)}>Add Product</button>
      <button onClick={handleViewReports}>View Reports</button>{" "}
      <section>
        <h2>Clients</h2>
        <ul>
          {clients.map((client) => (
            <li key={client.ID_Client}>
              {client.Nume} - {client.Email} - {client.Telefon}
            </li>
          ))}
        </ul>
      </section>
      {/* Products List */}
      <section>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.ID_Produs}>
              {product.Denumire} (Stock: {product.Cantitate_Stoc})
              <button
                onClick={() => {
                  setSelectedProductForEdit(product);
                  setIsProductEditModalOpen(true); // Open the modal for editing
                }}
              >
                Edit
              </button>
              <button onClick={() => handleDeleteProduct(product.ID_Produs)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
      {/* Orders List */}
      <section>
        <h2>Orders</h2>
        <ul>
          {orders.map((order) => (
            <li key={order.ID_Comanda}>
              Order #{order.ID_Comanda} - Client: {order.Client_Name} - Status:{" "}
              {order.Status}
            </li>
          ))}
        </ul>
      </section>
      {/* Modal for editing a product */}
      <Modal
        isOpen={isProductEditModalOpen && selectedProductForEdit !== null}
        onRequestClose={() => setIsProductEditModalOpen(false)}
      >
        <h2>Edit Product</h2>

        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={selectedProductForEdit?.Denumire || ""}
            onChange={(e) =>
              setSelectedProductForEdit({
                ...selectedProductForEdit,
                Denumire: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Stock Quantity:</label>
          <input
            type="number"
            value={selectedProductForEdit?.Cantitate_Stoc || 0}
            onChange={(e) =>
              setSelectedProductForEdit({
                ...selectedProductForEdit,
                Cantitate_Stoc: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            value={selectedProductForEdit?.Pret_Unitar || 0}
            onChange={(e) =>
              setSelectedProductForEdit({
                ...selectedProductForEdit,
                Pret_Unitar: e.target.value,
              })
            }
          />
        </div>

        <button onClick={handleEditProduct}>Save Changes</button>
        <button onClick={() => setIsProductEditModalOpen(false)}>Close</button>
      </Modal>
      {/* Modal for adding a new client */}
      <Modal
        isOpen={isClientModalOpen}
        onRequestClose={() => setIsClientModalOpen(false)}
      >
        <h2>Add Client</h2>
        <input
          type="text"
          placeholder="Name"
          value={newClient.Nume}
          onChange={(e) => setNewClient({ ...newClient, Nume: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newClient.Email}
          onChange={(e) =>
            setNewClient({ ...newClient, Email: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          value={newClient.Telefon}
          onChange={(e) =>
            setNewClient({ ...newClient, Telefon: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          value={newClient.Adresa}
          onChange={(e) =>
            setNewClient({ ...newClient, Adresa: e.target.value })
          }
        />
        <select
          value={newClient.Tip_Client}
          onChange={(e) =>
            setNewClient({ ...newClient, Tip_Client: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
        </select>
        <button onClick={handleCreateClient}>Create Client</button>
        <button onClick={() => setIsClientModalOpen(false)}>Close</button>
      </Modal>
      {/* Modal for adding a new product */}
      <Modal
        isOpen={isProductModalOpen}
        onRequestClose={() => setIsProductModalOpen(false)}
      >
        <h2>Create Product</h2>

        {/* Product Name */}
        <div>
          <label>
            <strong>Product Name (Denumire)</strong>
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            value={newProduct.Denumire}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Denumire: e.target.value })
            }
          />
          {!newProduct.Denumire && (
            <small style={{ color: "red" }}>Product name is required.</small>
          )}
        </div>

        {/* Stock Quantity */}
        <div>
          <label>
            <strong>Stock Quantity (Cantitate_Stoc)</strong>
          </label>
          <input
            type="number"
            placeholder="Enter stock quantity"
            value={newProduct.Cantitate_Stoc}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Cantitate_Stoc: e.target.value })
            }
          />
          {newProduct.Cantitate_Stoc <= 0 && (
            <small style={{ color: "red" }}>
              Stock quantity must be greater than 0.
            </small>
          )}
        </div>

        {/* Price */}
        <div>
          <label>
            <strong>Price (Pret_Unitar)</strong>
          </label>
          <input
            type="number"
            placeholder="Enter price"
            value={newProduct.Pret_Unitar}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Pret_Unitar: e.target.value })
            }
          />
          {newProduct.Pret_Unitar <= 0 && (
            <small style={{ color: "red" }}>
              Price must be greater than 0.
            </small>
          )}
        </div>

        {/* Description */}
        <div>
          <label>
            <strong>Description (Descriere)</strong>
          </label>
          <textarea
            placeholder="Enter product description"
            value={newProduct.Descriere}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Descriere: e.target.value })
            }
          ></textarea>
        </div>

        {/* Dimensions */}
        <div>
          <label>
            <strong>Dimensions (Dimensiuni)</strong>
          </label>
          <input
            type="text"
            placeholder="Enter product dimensions"
            value={newProduct.Dimensiuni}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Dimensiuni: e.target.value })
            }
          />
        </div>

        {/* Product Type */}
        <div>
          <label>
            <strong>Product Type (Tip Produs)</strong>
          </label>
          <input
            type="text"
            placeholder="Enter product type"
            value={newProduct.Tip_Produs}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Tip_Produs: e.target.value })
            }
          />
        </div>

        {/* Production Duration */}
        <div>
          <label>
            <strong>Production Duration (Durata Productie)</strong>
          </label>
          <input
            type="number"
            placeholder="Enter production duration in minutes"
            value={newProduct.Durata_Productie || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Durata_Productie: e.target.value })
            }
          />
          {newProduct.Durata_Productie <= 0 && (
            <small style={{ color: "red" }}>
              Production duration must be greater than 0.
            </small>
          )}
        </div>

        {/* Status */}
        <div>
          <label>
            <strong>Status</strong>
          </label>
          <select
            value={newProduct.Status_Produs}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Status_Produs: e.target.value })
            }
          >
            <option value="activ">Active</option>
            <option value="inactiv">Inactive</option>
          </select>
        </div>

        {/* Buttons */}
        <div>
          <button
            onClick={handleCreateProduct}
            disabled={
              !newProduct.Denumire ||
              newProduct.Cantitate_Stoc <= 0 ||
              newProduct.Pret_Unitar <= 0 ||
              newProduct.Durata_Productie <= 0
            }
          >
            Create Product
          </button>
          <button onClick={() => setIsProductModalOpen(false)}>Close</button>
        </div>
      </Modal>
      {/* Modal for creating an order */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>Create Order</h2>
        <select
          value={selectedClient?.ID_Client || ""}
          onChange={(e) =>
            setSelectedClient(
              clients.find((client) => client.ID_Client === e.target.value)
            )
          }
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.ID_Client} value={client.ID_Client}>
              {client.Nume}
            </option>
          ))}
        </select>
        <select
          value={selectedProduct?.ID_Produs || ""}
          onChange={(e) =>
            setSelectedProduct(
              products.find((product) => product.ID_Produs === e.target.value)
            )
          }
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.ID_Produs} value={product.ID_Produs}>
              {product.Denumire}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={orderQuantity}
          onChange={(e) => setOrderQuantity(e.target.value)}
        />
        <button onClick={handleCreateOrder}>Create Order</button>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
      {/* Modal for starting production */}
      <Modal
        isOpen={isProductionModalOpen}
        onRequestClose={() => setIsProductionModalOpen(false)}
      >
        <h2>Start Production</h2>
        <select
          value={selectedProduct?.ID_Produs || ""}
          onChange={(e) =>
            setSelectedProduct(
              products.find((product) => product.ID_Produs === e.target.value)
            )
          }
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.ID_Produs} value={product.ID_Produs}>
              {product.Denumire}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={productionQuantity}
          onChange={handleQuantityChange}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleStartProduction}>Start Production</button>
        <button onClick={() => setIsProductionModalOpen(false)}>Close</button>
      </Modal>
      {/* Reports Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onRequestClose={() => setIsReportModalOpen(false)}
      >
        <h2>Reports</h2>
        <div>
          <h3>Total Orders</h3>
          <p>{reportData ? reportData.totalOrders : "Loading..."}</p>
        </div>
        <div>
          <h3>Active Products</h3>
          <p>{reportData ? reportData.activeProducts : "Loading..."}</p>
        </div>
        <div>
          <h3>Low Stock Products (&lt;= 5 items)</h3> {/* Corectat */}
          <p>{reportData ? reportData.lowStockProducts : "Loading..."}</p>
        </div>
        <button onClick={() => setIsReportModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
