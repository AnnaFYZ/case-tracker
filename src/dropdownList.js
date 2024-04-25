import { useState } from "react";

const CheckboxDropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (e) => {
    const { value } = e.target;
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div className="dropdown">
      <div className="dropdown-label" onClick={toggleDropdown}>^</div>
      {isOpen && (
        <div className="dropdown-content">
          {options.map((option, index) => (
            <label key={index}>
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={handleOptionChange}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      )}
      <div className="selected-items">
        {selectedOptions.map((option, index) => (
          <div key={index}>{option}</div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxDropdown;
