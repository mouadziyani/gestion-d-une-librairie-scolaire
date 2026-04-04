import React from "react";

function Nav() {
  return (
      <div>
        <nav>
          <div>
            <span>Librairie</span>BOUGDIM
          </div>
          <div>
            <input type="text" />
            <button>search</button>
          </div>
          <ul>
            <li><a href="#">Aceuil</a></li>
            <li><a href="#">Category</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Login</a></li>
          </ul>
        </nav>
      </div>
  );
}

export default Nav;