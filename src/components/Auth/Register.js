import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import '../../styles/register.css'; 

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { success } = await register(formData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit}>
        <Input
          type="text"
          name="username"
          value={username}
          placeholder="Enter your username"
          onChange={onChange}
          required
        />
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
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default Register;