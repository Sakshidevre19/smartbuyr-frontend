import { useEffect, useState } from "react";
import { fetchProducts, searchProducts } from "../services/api";
import { useSearchParams } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      searchProducts(query, page).then(res => {
        setProducts(res.data.results);   // IMPORTANT
      });
    } else {
      fetchProducts(page).then(res => {
        setProducts(res.data.results);   // IMPORTANT
      });
    }
  }, [page, query]);

  return (
    <div>
      <h2>Products</h2>

      {products.length === 0 && <p>No products found</p>}

      {products.map(p => (
        <div key={p.id}>
          <h4>{p.title}</h4>
          <p>₹{p.price}</p>
        </div>
      ))}

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>

      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default ProductList;
