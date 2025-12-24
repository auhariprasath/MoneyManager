import { useNavigate } from "react-router-dom"
export const Home = () => {
  const navigate = useNavigate(); 
  return (
    <>
      <button onClick ={()=> navigate('/profile')}>Profile</button>
      <h1 style={{ textAlign: 'center' }}>Welcome to Money Manager</h1>
      <p>current_balance:</p>
      <button onClick={() => navigate("/transactions")}>Transactions</button>
      <button onClick={() => navigate("/analytics")}>Analytics</button>
      <button onClick={() => navigate("/budget")}>Budget</button>
    </>
  )
}
