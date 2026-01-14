import React, { useState, useEffect } from 'react'

function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: '', category: '', amount: '', notes: '' });
  const balance = transactions.reduce((acc, t) => {
    const amt = Number(t.amount) || 0;
    return acc + (t.type === 'income' ? amt : -amt);
  }, 0);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/transaction/all');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch when component mounts
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggle = () => {
    const next = !visible;
    setVisible(next);
    if (next) fetchTransactions();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAdd = async () => {
    // basic validation
    if (!form.type || !form.category || !form.amount) {
      alert('Please fill type, category and amount');
      return;
    }

    try {
      const body = {
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        notes: form.notes || ''
      };

      const res = await fetch('http://localhost:8080/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to add transaction');
      await res.json();
      setForm({ type: '', category: '', amount: '', notes: '' });
      setShowAdd(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction');
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => setShowAdd((s) => !s)}>{showAdd ? 'Close Add' : 'Add'}</button>
          <button onClick={fetchTransactions} style={{ marginLeft: 8 }}>Refresh</button>
        </div>

        {showAdd && (
          <div style={{ border: '1px solid #ccc', padding: 8, marginBottom: 12 }}>
            <div>
              <label>Type: </label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">-- select --</option>
                <option value="income">Income</option>
                <option value="spending">Spending</option>
              </select>
            </div>
            <div>
              <label>Category: </label>
              <input name="category" value={form.category} onChange={handleChange} />
            </div>
            <div>
              <label>Amount: </label>
              <input name="amount" type="number" value={form.amount} onChange={handleChange} />
            </div>
            <div>
              <label>Notes: </label>
              <input name="notes" value={form.notes} onChange={handleChange} />
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={handleAdd}>Submit</button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 8, fontWeight: 600 }}>
          Current Balance: {balance}
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 6 }}>Type</th>
                <th style={{ border: '1px solid #ddd', padding: 6 }}>Category</th>
                <th style={{ border: '1px solid #ddd', padding: 6 }}>Amount</th>
                <th style={{ border: '1px solid #ddd', padding: 6 }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: 6 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 8 }}>No transactions</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id || t._id}>
                    <td style={{ border: '1px solid #eee', padding: 6 }}>{t.type}</td>
                    <td style={{ border: '1px solid #eee', padding: 6 }}>{t.category}</td>
                    <td style={{ border: '1px solid #eee', padding: 6 }}>{t.amount}</td>
                    <td style={{ border: '1px solid #eee', padding: 6 }}>{t.date}</td>
                    <td style={{ border: '1px solid #eee', padding: 6 }}>{t.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Transaction