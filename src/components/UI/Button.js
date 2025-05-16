const Button = ({ children, type, onClick }) => {
  return (
    <button type={type || 'button'} className="btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;