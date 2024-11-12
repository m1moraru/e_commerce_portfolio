// src/pages/Kids.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Kids() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products/category/kids')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div>
      <h1>Kid's Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Kids;
