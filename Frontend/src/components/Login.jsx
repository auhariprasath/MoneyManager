import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    occupation: '',
    monthlyIncome: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      if (res.ok) {
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        profile: {
          age: Number(form.age),
          occupation: form.occupation,
          monthlyIncome: Number(form.monthlyIncome)
        }
      };
      const res = await fetch('http://localhost:8080/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('Registered successfully');
        navigate('/login');
      } else {
        const error = await res.text();
        alert(error);
      }
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <table>
          {isRegister && (
            <tr>
              <td>Name:</td>
              <td><input type="text" name="name" value={form.name} onChange={handleChange} required /></td>
            </tr>
          )}
          <tr>
            <td>Email:</td>
            <td><input type="email" name="email" value={form.email} onChange={handleChange} required /></td>
          </tr>
          <tr>
            <td>Password:</td>
            <td><input type="password" name="password" value={form.password} onChange={handleChange} required /></td>
          </tr>
          {isRegister && (
            <>
              <tr>
                <td>Age:</td>
                <td><input type="number" name="age" value={form.age} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td>Occupation:</td>
                <td><input type="text" name="occupation" value={form.occupation} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td>Monthly Income:</td>
                <td><input type="number" name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} required /></td>
              </tr>
            </>
          )}
          <tr>
            <td colSpan="2">
              {isRegister ? (
                <>
                  <button type="button" onClick={handleRegister}>Register</button>
                  <button type="button" onClick={() => setIsRegister(false)}>Back to Login</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={handleLogin}>Login</button>
                  <button type="button" onClick={() => setIsRegister(true)}>Register</button>
                </>
              )}
            </td>
          </tr>
        </table>
      </form>
    </div>
  );
}

export default Login;