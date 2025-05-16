import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { success } = await login(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit}>
        <Input
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          onChange={onChange}
          required
        />
        <Input
          type="password"
          name="password"
          value={password}
          placeholder="Enter your password"
          onChange={onChange}
          required
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;