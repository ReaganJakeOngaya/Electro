
import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
// import smartphoneImage from './images/undraw_smart_orrt.png';

const Home = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const options = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="header-section ">
        <text>
          <h1 className="display-1 fw-bold">Device <br/> Yangu</h1>
          <p className="lead">Where use meets simplicity and  luxury.</p>
          <img  src='/images/computer.png' className='all-rights'/>

    
        </text>
    <div className="image-container">
      <img src="/images/undraw_smart_orrt.png" alt="smartphone" className="background-image" />
      <div className="button-container">
        <button>
          <a href="/login">Already a user?</a>
        </button>
        <button>
          <a href="/register">Become a user?</a>
        </button>
      </div>
    </div>
      </header>

      
      {/* <section className="section section-one  align-items-center justify-content-center">
       <h2 className="fw-bold">Fastest SEO</h2>
       <div className='part'></div>
        <div className="content text-center">
          <p className='paragraph'>We provide you on of the most enhanced search engine to meet your needs fast and precise.</p>
        </div>
        <div className='image-container'>
          <img src="/images/search-engine.png" alt="search" className="background-image" />
        </div>
      </section>

      
      <section className="section section-two d-flex align-items-center justify-content-center">
        <div className="content text-center">
          <h2 className="fw-bold">Built for Performance</h2>
          <p>Uncompromised speed and reliability.</p>
        </div>
      </section>

      
      <section className="section section-three d-flex align-items-center justify-content-center">
        <div className="content text-center">
          <h2 className="fw-bold">Crafted for You</h2>
          <p>Personalized to meet your unique needs.</p>
        </div>
      </section> */}

    
    </div>
  );
};

export default Home;
