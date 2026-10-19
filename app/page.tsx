const services = [

  ["🔧", "Plumber", "Leaks, taps, pipes and bathroom repairs"],

  ["⚡", "Electrician", "Wiring, switches, fans and fittings"],

  ["🧹", "Home Worker", "Cleaning and everyday home help"],

  ["🪚", "Carpenter", "Furniture repair and woodwork"],

  ["❄️", "AC Service", "Installation, repair and maintenance"],

  ["🎨", "Painter", "Interior and exterior painting"],

];

export default function Home() {

  return (

    <main>

      <header className="nav">

        <a className="brand" href="#">

          <span className="logo">⌂</span> Home<span>Doctor</span>

        </a>

        <nav>

          <a href="#services">Services</a>

          <a href="#how">How it works</a>

          <a href="#worker">Join as worker</a>

        </nav>

        <a className="button small" href="/auth">
  Login / Sign up
</a>

        

    

      </header>

      <section className="hero">

        <div className="heroText">

          <p className="eyebrow">PROFESSIONAL · RELIABLE · AFFORDABLE</p>

          <h1>

            All your home services

            <br />

            in one place.

          </h1>

          <p className="sub">

            Book trusted plumbers, electricians, cleaners and more — right at

            your doorstep.

          </p>

          <form className="search" action="#services">

            <input

              aria-label="Location"

              placeholder="Enter city, PIN code or area"

            />

            <button className="button" type="submit">

              Find services

            </button>

          </form>

          <div className="trust">

            <span>✓ Verified professionals</span>

            <span>◷ On-time service</span>

            <span>★ Clear pricing</span>

          </div>

        </div>

        <div className="heroArt">

          <div className="workerEmoji">🧑🏽‍🔧</div>

          <div className="bubble">

            Your home

            <br />

            is in good hands

          </div>

        </div>

      </section>

      <section id="services" className="section">

        <div className="sectionTitle">

          <div>

            <p className="eyebrow">WHAT DO YOU NEED?</p>

            <h2>Explore services</h2>

          </div>

          <p>More services, one trusted place.</p>

        </div>

        <div className="grid">

          {services.map(([icon, name, desc]) => (

            <article className="service" key={name}>

              <div className="icon">{icon}</div>

              <h3>{name}</h3>

              <p>{desc}</p>

              <a href="#account">Book service →</a>

            </article>

          ))}

        </div>

      </section>

      <section className="band" id="how">

        <p className="eyebrow">SIMPLE AND CONVENIENT</p>

        <h2>How Home Doctor works</h2>

        <div className="steps">

          <div>

            <b>1</b>

            <h3>Choose a service</h3>

            <p>Select the job you need done.</p>

          </div>

          <div>

            <b>2</b>

            <h3>Find a professional</h3>

            <p>Review profiles, distance and ratings.</p>

          </div>

          <div>

            <b>3</b>

            <h3>Confirm booking</h3>

            <p>Choose a time and confirm details.</p>

          </div>

          <div>

            <b>4</b>

            <h3>Pay and review</h3>

            <p>Pay securely and share feedback.</p>

          </div>

        </div>

      </section>

      <section className="section join" id="worker">

        <div>

          <p className="eyebrow">GROW YOUR BUSINESS</p>

          <h2>Are you a home-service professional?</h2>

          <p>

            Register with Home Doctor to connect with customers in your area.

          </p>

        </div>

        <a className="button" href="#account">

          Register as a worker

        </a>

      </section>

      <section className="section account" id="account">

        <p className="eyebrow">GET STARTED</p>

        <h2>Choose how you want to use Home Doctor</h2>

        <div className="accountGrid">

          <article>

            <h3>I'm a customer</h3>

            <p>Find nearby workers and manage your bookings.</p>

            <a className="button" href="mailto:support@homedoctor.example">

              Customer sign-in setup required

            </a>

          </article>

          <article>

            <h3>I'm a worker</h3>

            <p>Register your skills, service area and availability.</p>

            <a className="button" href="#worker">

              Worker registration

            </a>

          </article>

        </div>

        <p className="notice">

          This is a website preview. Live accounts, nearby-worker search,

          reviews, admin tools and online payments still require backend setup.

        </p>

      </section>

      <footer>

        <div className="brand light">

          ⌂ Home<span>Doctor</span>

        </div>

        <p>Trusted home services, across India.</p>

        <div className="footerLinks">

          <a href="#services">Services</a>

          <a href="#worker">Become a professional</a>

          <a href="#how">How it works</a>

          <a href="mailto:support@homedoctor.example">Contact</a>

        </div>

        <small>© Home Doctor. Update contact details before launch.</small>

      </footer>

    </main>

  );

}
