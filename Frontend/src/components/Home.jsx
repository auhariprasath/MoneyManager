import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export const Home = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:8080/transaction/all");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const bal = list.reduce((acc, t) => {
          const amt = Number(t.amount) || 0;
          return acc + (t.type === 'income' ? amt : -amt);
        }, 0);
        setBalance(bal);
      } catch (err) {
        console.error(err);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <>
      <button onClick ={()=> navigate('/profile')}>Profile</button>
      <h1 style={{ textAlign: 'center' }}>Welcome to Money Manager</h1>
      <p>
        Current balance: {loading ? 'Loading...' : balance}
      </p>
      <button onClick={() => navigate("/transactions")}>Transactions</button>
      <button onClick={() => navigate("/analytics")}>Analytics</button>
      <button onClick={() => navigate("/budget")}>Budget</button>
    </>
  )
}
