import './Signin.css';

export default function Signin() {
  return (
    <div className="ps-page">
      <div className="ps-hero">
        <div className="brand">
          <h1 className="brand-title">PITCH
            <span className="arrows">&gt;&gt;</span>
            <br />SPHERE</h1>
          <p className="brand-sub">CREATE. EMPOWER. SUSTAINABLY.</p>
        </div>
        <div className="bg-sphere" />
      </div>

      <aside className="ps-panel">
        <div className="panel-inner">
          <div className="panel-top">
            <div className="panel-logo">&gt;&gt;</div>
            <h3 className="panel-title">SIGN IN TO CONTINUE</h3>
          </div>

          <div className="form-row">
            <input className="pill" placeholder="ENTER EMAIL OR USERNAME" />
          </div>
          <div className="form-row small-row">
            <input className="pill" placeholder="ENTER PASSWORD" type="password" />
            <button className="btn-proceed">PROCEED</button>
          </div>

          <div className="or-get">OR GET STARTED TODAY !</div>

          <button className="btn-cta">JOIN THE WORLD OF PITCH SPHERE</button>
        </div>
      </aside>
    </div>
  );
}
