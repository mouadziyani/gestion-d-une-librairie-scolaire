import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getNavbarPageSections } from "../../utils/helpers";

function Pages() {
  const { user } = useContext(AuthContext);
  const sections = getNavbarPageSections(user?.role?.slug);

  return (
    <div className="pages-directory-page">
      <section className="pages-directory-hero">
        <span className="eyebrow-label">Navigation</span>
        <h1 className="page-shell-title">All Pages</h1>
        <p className="page-shell-subtitle">
          A quick index of the pages available for your current role.
        </p>
      </section>

      <section className="pages-directory-grid">
        {sections.map((section) => (
          <article key={section.label} className="pages-directory-card">
            <h2>{section.label}</h2>
            <div className="pages-directory-links">
              {section.links.map((link) => (
                <Link key={link.path} to={link.path} className="pages-directory-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Pages;
