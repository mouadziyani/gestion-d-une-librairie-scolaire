import React from "react";

function Footer() {
  return (
    <footer>
      <div>
        <h3>Librairie BOUGDIM</h3>
        <p>Votre bibliothèque en ligne de confiance</p>
      </div>
      <div>
        <a href="#">Accueil</a> | 
        <a href="#">Catégorie</a> | 
        <a href="#">Contact</a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} Librairie BOUGDIM. Tous droits réservés.
      </div>
      <div>
        Developer of this web <a href="https://www.mouadziyani.com/">Mouad Ziyani</a>
      </div>
    </footer>
  );
}

export default Footer;