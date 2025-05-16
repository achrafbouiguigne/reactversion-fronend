const Input = ({ type, name, value, placeholder, onChange, required }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="form-input"
      />
    </div>
  );
};

export default Input;