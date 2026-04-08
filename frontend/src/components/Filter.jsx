import React from "react";

function Filter() {
  return (
    <div>
      <form action="#">
        <fieldset>
          <legend>Filter</legend>
          <div>
            <label htmlFor="filter">Keyword:</label><br />
            <input type="text" id="filter" name="filter" />
          </div>
          <div>
            <button type="submit">Apply</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default Filter;
