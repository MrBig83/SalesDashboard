import logo from '../../../assets/brand/logo.png'
import './DashboardHero.css'

export const DashboardHero = () => (
  <section className="dashboard-hero">
    <div className="dashboard-hero__copy">
      <div className="dashboard-hero__brand">
        <img src={logo} alt="Brand logo" className="dashboard-hero__logo" />
        <div className="dashboard-hero__brand-copy">
          <span className="dashboard-hero__eyebrow">Admin Dashboard</span>
          <p className="dashboard-hero__brand-text">Tasting analytics workspace</p>
        </div>
      </div>
      <h1>Sales insight hub for tasting reports</h1>
      <p>
        Filtrera per brand, välj rapportfält och skapa en dynamisk länk som
        visar exakt samma urval för mottagaren.
      </p>
    </div>
  </section>
)
