import { useEffect, useState } from "react";

const links = ["about", "skills", "projects", "credentials", "contact"];

const skills = [
  { title: "Languages", items: ["Java", "Python", "C++", "C", "JavaScript"] },
  { title: "Backend", items: ["Spring Boot", "Spring Security", "REST APIs", "JWT"] },
  { title: "Data & ML", items: ["PostgreSQL", "MySQL", "Scikit-learn", "Pandas", "PCA"] },
  { title: "Tools", items: ["Git", "GitHub", "Postman", "IntelliJ IDEA", "Power BI"] }
];

const projects = [
  {
    featured: true, index: "01", title: "Siblings Kitchen", eyebrow: "Featured full-stack project",
    description: "A deployed food-ordering platform with secure customer and administrator workflows, complete ordering journeys, and subscription management.",
    highlights: ["JWT + BCrypt security", "Role-based administration", "Cart, checkout & tracking", "Monthly meal subscriptions"],
    stack: ["Java", "Spring Boot", "PostgreSQL", "JavaScript"],
    github: "https://github.com/sreenidhithota12-dotcom/siblings-kitchen", live: "https://siblings-kitchen.onrender.com/"
  },
  {
    index: "02", title: "Student Performance Predictor", eyebrow: "Machine learning web app",
    description: "An end-to-end ML pipeline that compares predictive models and delivers real-time student-performance predictions through Streamlit.",
    highlights: ["Preprocessing & PCA", "Cross-validation", "Real-time predictions"],
    stack: ["Python", "Scikit-learn", "Streamlit"],
    github: "https://github.com/sreenidhithota12-dotcom/StudentPerformanceProject", live: "https://studentperformanceproject-n6urwuhsvahcbvpifuqmon.streamlit.app/"
  },
  {
    index: "03", title: "A* Maze Solver", eyebrow: "AI search visualizer",
    description: "An interactive pathfinding visualizer that uses A* search and the Manhattan-distance heuristic to find optimal routes through grid mazes.",
    highlights: ["A* search", "Optimal pathfinding", "Exploration visualization"],
    stack: ["Python", "Tkinter", "Artificial Intelligence"],
    github: "https://github.com/sreenidhithota12-dotcom/a-star-maze-solver"
  }
];

const ArrowIcon = () => <span aria-hidden="true">↗</span>;

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <a className="brand" href="#top" aria-label="Sreenidhi Thota home">ST<span>.</span></a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span></span><span></span></button>
      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary navigation">
        {links.map(link => <a key={link} href={`#${link}`} onClick={() => setOpen(false)}>{link}</a>)}
      </nav>
    </header>
  );
}

function SectionHeading({ label, title, copy }) {
  return <div className="section-heading"><p className="section-label">{label}</p><div><h2>{title}</h2>{copy && <p>{copy}</p>}</div></div>;
}

function ProjectCard({ project }) {
  return (
    <article className={project.featured ? "project-card featured" : "project-card"}>
      <div className="project-number">{project.index}</div>
      <div className="project-body">
        <p className="project-eyebrow">{project.eyebrow}</p><h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <ul className="project-highlights">{project.highlights.map(item => <li key={item}>{item}</li>)}</ul>
        <div className="tech-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
      </div>
      <div className="project-actions">
        <a href={project.github} target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a>
        {project.live && <a className="primary-link" href={project.live} target="_blank" rel="noreferrer">Live site <ArrowIcon /></a>}
      </div>
    </article>
  );
}

export default function App() {
  return <>
    <Header />
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
        <p className="hero-kicker"><span></span> Open to software and AI/ML internships</p>
        <h1 id="hero-title">I build reliable software and <em>intelligent systems.</em></h1>
        <p className="hero-copy">I'm Sreenidhi Thota, a Computer Science Engineering student at CBIT turning ideas into deployed full-stack applications and practical machine learning products.</p>
        <div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <ArrowIcon /></a><a className="button button-secondary" href="mailto:sreenidhithota12@gmail.com">Contact me</a></div>
        <div className="hero-meta" aria-label="Highlights"><div><strong>9.02</strong><span>CGPA / 10</span></div><div><strong>300+</strong><span>LeetCode problems</span></div><div><strong>3</strong><span>Major projects</span></div></div>
      </section>

      <section id="about" className="section about-section">
        <SectionHeading label="01 / About" title="Engineering with curiosity and intent." />
        <div className="about-grid">
          <p className="about-lead">I enjoy working where <span>software engineering</span> meets <span>machine learning</span>—building systems that are useful, secure, and ready for real users.</p>
          <div className="about-copy"><p>Currently pursuing a B.E. in Computer Science and Engineering (AI & ML) at Chaitanya Bharathi Institute of Technology, Hyderabad.</p><p>My work spans Spring Boot backends, responsive web interfaces, REST APIs, databases, algorithmic problem solving, and end-to-end ML workflows.</p></div>
        </div>
        <div className="education-card"><div><span>2024 — 2028</span><h3>Chaitanya Bharathi Institute of Technology</h3><p>B.E. CSE — Artificial Intelligence & Machine Learning</p></div><strong>CGPA 9.02/10</strong></div>
      </section>

      <section id="skills" className="section">
        <SectionHeading label="02 / Skills" title="A practical, growing toolkit." copy="Technologies I have used across coursework and projects." />
        <div className="skills-grid">{skills.map((group, i) => <article className="skill-group" key={group.title}><span>0{i + 1}</span><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
      </section>

      <section id="projects" className="section projects-section">
        <SectionHeading label="03 / Projects" title="Selected work, built end to end." copy="Each project links to the code, and deployed projects can be explored live." />
        <div className="projects-list">{projects.map(project => <ProjectCard project={project} key={project.title} />)}</div>
      </section>

      <section id="credentials" className="section credentials-section">
        <SectionHeading label="04 / Credentials" title="Progress beyond the classroom." />
        <div className="credentials-grid">
          <article className="credential-card accent-card"><span>Problem solving</span><strong>300+</strong><h3>LeetCode problems solved</h3><p>Data structures, algorithms, dynamic programming, graphs, binary search, and SQL.</p><a href="https://leetcode.com/u/SREENIDHI_THOTA/" target="_blank" rel="noreferrer">View profile <ArrowIcon /></a></article>
          <article className="credential-card"><span>Certification</span><div className="oracle-mark">OCI</div><h3>Oracle Cloud Infrastructure 2025</h3><p>Certified AI Foundations Associate</p></article>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <p className="section-label">05 / Contact</p><h2>Have an opportunity or an idea?</h2><p>I'm open to internships, collaborative projects, and conversations about software and AI.</p>
        <a className="contact-email" href="mailto:sreenidhithota12@gmail.com">sreenidhithota12@gmail.com <ArrowIcon /></a>
        <div className="social-links"><a href="https://github.com/sreenidhithota12-dotcom" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/sreenidhi-thota-3080a2336/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://leetcode.com/u/SREENIDHI_THOTA/" target="_blank" rel="noreferrer">LeetCode</a><a href="https://www.hackerrank.com/profile/sreenidhithota12" target="_blank" rel="noreferrer">HackerRank</a></div>
      </section>
    </main>
    <footer><span>© 2026 Sreenidhi Thota</span><span>Designed & built with React</span></footer>
  </>;
}
