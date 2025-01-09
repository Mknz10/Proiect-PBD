// Import dependencies
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

// Initialize the Express app
const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "PVC_Management",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// API Routes

// Fetch all clients
app.get("/clients", (req, res) => {
  db.query("SELECT * FROM Clienti", (err, results) => {
    if (err) {
      console.error("Error fetching clients:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Create a new client
app.post("/clients", (req, res) => {
  const { Nume, Email, Telefon } = req.body;

  if (!Nume || !Email || !Telefon) {
    return res
      .status(400)
      .json({ error: "All fields (Nume, Email, Telefon) are required" });
  }

  const query = "INSERT INTO Clienti (Nume, Email, Telefon) VALUES (?, ?, ?)";

  db.query(query, [Nume, Email, Telefon], (err, result) => {
    if (err) {
      console.error("Error adding client:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({
      message: "Client created successfully",
      clientId: result.insertId,
    });
  });
});

// Update an existing client
app.put("/clients/:id", (req, res) => {
  const { id } = req.params;
  const { Nume, Email, Telefon } = req.body;

  if (!Nume || !Email || !Telefon) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "UPDATE Clienti SET Nume = ?, Email = ?, Telefon = ? WHERE ID_Client = ?";
  db.query(query, [Nume, Email, Telefon, id], (err, result) => {
    if (err) {
      console.error("Error updating client:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Client updated successfully" });
  });
});

// Delete a client
app.delete("/clients/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Clienti WHERE ID_Client = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting client:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Client deleted successfully" });
  });
});

// Fetch all orders
app.get("/orders", (req, res) => {
  const query = `
    SELECT c.ID_Comanda, c.Data_Comanda, c.Status, cl.Nume AS Client_Name
    FROM Comenzi c
    INNER JOIN Clienti cl ON c.ID_Client = cl.ID_Client
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Create a new order
app.post("/orders", (req, res) => {
  const { ID_Client, products } = req.body;

  if (
    !ID_Client ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const query =
    "INSERT INTO Comenzi (ID_Client, Data_Comanda, Status) VALUES (?, NOW(), ?)";

  db.query(query, [ID_Client, "in procesare"], (err, result) => {
    if (err) {
      console.error("Error creating order:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    const orderId = result.insertId;

    // Process each product in the order
    const orderDetailsQuery =
      "INSERT INTO Detalii_Comenzi (ID_Comanda, ID_Produs, Cantitate) VALUES ?";
    const orderDetails = products.map((p) => [
      orderId,
      p.ID_Produs,
      p.Cantitate,
    ]);

    db.query(orderDetailsQuery, [orderDetails], (err) => {
      if (err) {
        console.error("Error inserting order details:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Adjust stock for each product
      products.forEach((p) => {
        const stockQuery = `
          UPDATE Produse_Finite
          SET Cantitate_Stoc = Cantitate_Stoc - ?
          WHERE ID_Produs = ?
        `;
        db.query(stockQuery, [p.Cantitate, p.ID_Produs], (err) => {
          if (err) {
            console.error("Error updating stock:", err);
          }
        });
      });

      res.status(201).json({ message: "Order created successfully", orderId });
    });
  });
});

app.put("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { Status } = req.body;

  try {
    const updatedOrder = await Order.update(
      { Status },
      { where: { ID_Comanda: orderId } }
    );
    if (updatedOrder[0] === 0) {
      return res.status(404).send("Order not found.");
    }
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    res.status(500).send("Error updating order status");
  }
});

// Fetch all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM Produse_Finite", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Create a new product
app.post("/products", (req, res) => {
  const {
    Denumire,
    Pret_Unitar,
    Cantitate_Stoc,
    Descriere,
    Dimensiuni,
    Tip_Produs,
    Durata_Productie,
    Status_Produs,
  } = req.body;

  if (
    !Denumire ||
    !Pret_Unitar ||
    !Cantitate_Stoc ||
    !Descriere ||
    !Dimensiuni ||
    !Tip_Produs ||
    !Durata_Productie ||
    !Status_Produs
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO Produse_Finite (
      Denumire, Cantitate_Stoc, Pret_Unitar, Descriere, Dimensiuni, Tip_Produs, Durata_Productie, Status_Produs
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      Denumire,
      Cantitate_Stoc,
      Pret_Unitar,
      Descriere,
      Dimensiuni,
      Tip_Produs,
      Durata_Productie,
      Status_Produs,
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({
        message: "Product created successfully",
        productId: result.insertId,
      });
    }
  );
});

// Update an existing product
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { Denumire, Cantitate_Stoc, Pret_Unitar } = req.body;

  // Ensure fields are provided
  if (!Denumire || Cantitate_Stoc == null || Pret_Unitar == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Ensure Cantitate_Stoc and Pret are numbers
  const stockQuantity = parseFloat(Cantitate_Stoc);
  const price = parseFloat(Pret_Unitar);

  // Check if the parsed values are valid numbers
  if (isNaN(stockQuantity) || isNaN(price)) {
    return res.status(400).json({
      error: "Cantitate_Stoc and Pret must be valid numbers",
    });
  }

  // Proceed with updating the product
  const query =
    "UPDATE Produse_Finite SET Denumire = ?, Cantitate_Stoc = ?, Pret_Unitar = ? WHERE ID_Produs = ?";
  db.query(query, [Denumire, stockQuantity, price, id], (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Product updated successfully" });
  });
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Produse_Finite WHERE ID_Produs = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

// Production start endpoint
app.post("/production", (req, res) => {
  const { ID_Produs, quantity } = req.body;

  // Validate input
  if (!ID_Produs || !quantity || quantity <= 0) {
    return res.status(400).json({
      error: "Please provide a valid product and quantity",
    });
  }

  // Check stock availability before starting production
  const stockCheckQuery = `
    SELECT Cantitate_Stoc FROM Produse_Finite WHERE ID_Produs = ?
  `;
  db.query(stockCheckQuery, [ID_Produs], (err, results) => {
    if (err) {
      console.error("Error checking stock availability:", err);
      return res
        .status(500)
        .json({ error: "Error checking stock availability" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Product not found" });
    }

    const stockQuantity = results[0].Cantitate_Stoc;
    if (quantity > stockQuantity) {
      return res.status(400).json({
        error: `Insufficient stock. Available stock: ${stockQuantity}`,
      });
    }

    // Get the raw materials needed for the product
    const getRawMaterialsQuery =
      "SELECT * FROM Product_Raw_Material WHERE ID_Produs = ?";
    db.query(getRawMaterialsQuery, [ID_Produs], (err, rawMaterials) => {
      if (err) {
        console.error("Error fetching raw materials:", err);
        return res.status(500).json({
          error: "Internal server error while fetching raw materials",
        });
      }

      if (rawMaterials.length === 0) {
        console.error("No raw materials found for product:", ID_Produs);
        return res
          .status(400)
          .json({ error: "No raw materials found for this product" });
      }

      // Proceed with production, create record in Productie table
      const query = `
        INSERT INTO Productie (ID_Produs, Cantitate_Consumata, Data_Inceput, Status)
        VALUES (?, ?, NOW(), 'in desfasurare')
      `;

      db.query(query, [ID_Produs, quantity], (err, results) => {
        if (err) {
          console.error("Error executing production query:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Production started successfully" });
      });
    });
  });
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM Produse_Finite", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// Create a new product
app.post("/products", (req, res) => {
  const {
    Denumire,
    Cantitate_Stoc,
    Pret_Unitar,
    Descriere,
    Dimensiuni,
    Tip_Produs,
    Durata_Productie,
    Status_Produs,
  } = req.body;

  if (!Denumire || Cantitate_Stoc == null || Pret_Unitar == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "INSERT INTO Produse_Finite (Denumire, Cantitate_Stoc, Pret_Unitar, Descriere, Dimensiuni, Tip_Produs, Durata_Productie, Status_Produs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      Denumire,
      Cantitate_Stoc,
      Pret_Unitar,
      Descriere,
      Dimensiuni,
      Tip_Produs,
      Durata_Productie,
      Status_Produs,
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Send the new product data back
      res.status(201).json({
        message: "Product created successfully",
        product: {
          ID_Produs: result.insertId,
          Denumire,
          Cantitate_Stoc,
          Pret_Unitar,
          Descriere,
          Dimensiuni,
          Tip_Produs,
          Durata_Productie,
          Status_Produs,
        },
      });
    }
  );
});

// Update an existing product
// Update an existing product
app.put("/products/:id", (req, res) => {
  const { id } = req.params; // Extract product ID from URL
  const { Denumire, Cantitate_Stoc, Pret_Unitar } = req.body; // Extract data from request body

  // Validate input: Ensure all fields are provided and Cantitate_Stoc and Pret are numbers
  if (!Denumire || Cantitate_Stoc == null || Pret_Unitar == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const stockQuantity = parseFloat(Cantitate_Stoc); // Parse Cantitate_Stoc to a number
  const price = parseFloat(Pret_Unitar); // Parse Pret to a number

  // Ensure stockQuantity and price are valid numbers
  if (isNaN(stockQuantity) || isNaN(price)) {
    return res.status(400).json({
      error: "Cantitate_Stoc and Pret must be valid numbers",
    });
  }

  // SQL query to update the product
  const query =
    "UPDATE Produse_Finite SET Denumire = ?, Cantitate_Stoc = ?, Pret_Unitar = ? WHERE ID_Produs = ?";

  // Execute the query
  db.query(query, [Denumire, stockQuantity, price, id], (err, result) => {
    if (err) {
      console.error("Error updating product:", err); // Log error for debugging
      return res.status(500).json({ error: "Internal server error" });
    }

    // Check if the product was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Success response
    res.json({ message: "Product updated successfully" });
  });
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Produse_Finite WHERE ID_Produs = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

// Fetch all Product Raw Materials
app.get("/product_raw_materials", (req, res) => {
  const query = "SELECT * FROM Product_Raw_Material"; // Query to fetch data from Product_Raw_Material table

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching raw material data:", err);
      res.status(500).send("Error fetching raw material data");
      return;
    }
    res.json(results);
  });
});

// Fetch all production data
app.get("/production", (req, res) => {
  const query = `
    SELECT p.ID_Productie, p.ID_Produs, p.Cantitate_Consumata, p.Data_Inceput, p.Status, pr.Denumire AS Product_Name
    FROM Productie p
    INNER JOIN Produse_Finite pr ON p.ID_Produs = pr.ID_Produs
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching production data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      console.log("No production data found.");
    }

    // Send the production data as a response
    res.json(results);
  });
});

// Fetch all raw materials (Materia_Prima)
app.get("/materia_prima", (req, res) => {
  const query = `
    SELECT * FROM Materia_Prima
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching production data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      console.log("No production data found.");
    }

    // Send the production data as a response
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
