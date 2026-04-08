import React from "react";

function Dropdown() {
  return (
    <div>
      <div>
        <label htmlFor="DropdownSelect">Dropdown:</label><br />
        <select id="DropdownSelect" name="DropdownSelect">
          <option value="one">Option One</option>
          <option value="two">Option Two</option>
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
