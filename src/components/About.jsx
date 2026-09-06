import React from 'react';
import stackImage from '../assets/about/yusuf-avatar.png';
import { aboutContent, education } from '../data/portfolioData';
import { usePortfolioData } from '../context/PortfolioContext';

// Tech stack SVG icons rendered inline for crisp rendering
const JavaIcon = () => (
  <div className="flex flex-col items-center gap-2">
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 128 128">
      <path fill="#EA2D2E" d="M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.391-6.874-3.391-10.897 5.163-31.934 2.759-25.932-2.097 4.501-3.631 0 0-3.309-.481zM65.856 86.36c-11.756 6.392-26.996 7.086-18.907 1.186 0 0-7.915 5.163-16.747 9.202 0 0-2.31 2.259 8.003 2.981 17.168 1.199 43.879-.749 45.026-8.065 0 0 1.243-3.178-17.375-5.304z"/>
      <path fill="#EA2D2E" d="M83.528 71.122s5.58 5.784-6.154 10.372c-22.342 8.725-46.496.666-29.911-6.023 6.238-2.515 9.738-2.728 9.738-2.728s-3.397-2.4-11.715 2.103c-24.692 13.36 11.12 19.441 39.654 8.366 5.363-2.077 8.162-5.965 8.162-5.965-.001.001-9.774-6.125-9.774-6.125zM91.625 96.106c-.198.395-.461.781-.791 1.159 0 0 13.189-3.404 8.545-11.964-4.591-8.454-8.145-12.625 10.927-27.179 0 0-29.855 7.447-18.681 37.984z"/>
      <path fill="#EA2D2E" d="M76.203 0s11.752 11.752-11.146 29.835c-18.359 14.499-4.187 22.754-.005 32.198-10.7-9.662-18.555-18.159-13.29-26.074C59.003 24.494 80.823 18.793 76.203 0zM66.414 113.085c21.023 1.345 53.358-.745 54.156-10.672 0 0-1.473 3.777-17.441 6.776-18.02 3.384-40.215 2.988-53.367.819 0 .001 2.695 2.228 16.652 3.077z"/>
    </svg>
    <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Java</span>
  </div>
);

const SpringBootIcon = () => (
  <div className="flex flex-col items-center gap-2">
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 128 128">
      <path fill="#6DB33F" d="M116.452 6.643a59.104 59.104 0 01-6.837 12.136A64.249 64.249 0 0064.205-.026C28.984-.026 0 28.958 0 64.179c0 35.22 28.984 64.205 64.205 64.205 35.221 0 64.179-28.985 64.179-64.205 0-10.632-2.624-20.672-7.26-29.508a59.03 59.03 0 01-4.672-8.028zm-53.478 99.75c-23.407 0-42.392-18.985-42.392-42.393 0-23.407 18.985-42.392 42.392-42.392 4.016 0 7.907.563 11.591 1.607l-4.756 8.229a34.498 34.498 0 00-6.835-.683c-19.152 0-34.673 15.521-34.673 34.673 0 19.153 15.521 34.674 34.673 34.674 12.322 0 23.146-6.443 29.29-16.146l7.621 4.397c-7.966 12.614-22.043 20.984-37.911 20.034z"/>
      <path fill="#6DB33F" d="M96.118 56.392l-32.22 18.604-8.816-15.273 32.221-18.604z"/>
    </svg>
    <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Spring Boot</span>
  </div>
);

const MernIcon = () => (
  <div className="flex flex-col items-center gap-2">
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 128 128">
      {/* Central React Atom */}
      <g stroke="#00d8ff" strokeWidth="4.5" fill="none" transform="translate(10, 10)">
        <ellipse cx="54" cy="54" rx="16" ry="46" transform="rotate(30 54 54)" />
        <ellipse cx="54" cy="54" rx="16" ry="46" transform="rotate(90 54 54)" />
        <ellipse cx="54" cy="54" rx="16" ry="46" transform="rotate(150 54 54)" />
        <circle cx="54" cy="54" r="7" fill="#00d8ff" />
      </g>
      {/* MongoDB Leaf overlap overlay in bottom left */}
      <path fill="#439934" d="M36 84c-3-6-4-15 0-22 3 7 9 10 10 15 2 1.5 1 3-2 5l-8 2zm4-25c2 4 4 11 0 16-1-5-6-8-7-12-2-1-1-3 2-4l5 0z" opacity="0.9" />
      {/* Node.js Hexagon in top right */}
      <path fill="#339933" d="M98 32l-12-7-12 7v14l12 7 12-7V32zm-12 1.5l8 4.6v9.3l-8 4.6-8-4.6v-9.3l8-4.6z" opacity="0.9" />
    </svg>
    <span className="text-xs font-bold text-white/70 uppercase tracking-wider">MERN Stack</span>
  </div>
);

const About = () => {
  const { profile } = usePortfolioData();
  const avatarSrc = profile?.profileImageUrl || stackImage;
  const bioHtml = profile?.aboutDescription || aboutContent.bio;
  const headingText = profile?.aboutHeading || aboutContent.heading;

  return (
    <section id="about" className="bg-[#ff2a2a] pt-20 pb-40 px-6 md:px-12 w-full relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        
        {/* Left Side: ID Badge and Skills */}
        <div className="flex flex-col items-center w-full md:w-[350px] shrink-0 mt-12 md:mt-0">
          
          <div data-aos="drop-bounce" className="relative flex justify-center w-full">
            {/* Lanyard string */}
            <div className="absolute -top-32 left-1/2 w-3 h-40 bg-black transform -translate-x-1/2 shadow-inner z-0"></div>
            {/* Lanyard clip */}
            <div className="absolute -top-6 left-1/2 w-6 h-12 bg-gray-300 rounded border border-gray-400 transform -translate-x-1/2 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"></div>
            
            {/* Badge Card */}
            <div className="bg-gray-900 w-full max-w-[280px] rounded-2xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Cutout Hole */}
              <div className="absolute -top-3 left-1/2 w-16 h-6 bg-gray-900 rounded-t-xl transform -translate-x-1/2 flex justify-center items-center">
                <div className="w-8 h-2 bg-black/30 rounded-full shadow-inner"></div>
              </div>
              {/* Image Container */}
              <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-800 border-2 border-transparent">
                <img 
                  src={avatarSrc} 
                  alt="Abdul Munim — Full Stack & Java Developer" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Info Content */}
        <div data-aos="fade-left" data-aos-delay="200" className="flex-1 text-white mt-8 md:mt-0 relative z-20">
          
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">{headingText}</h2>
          <p 
            className="text-lg font-bold mb-8 leading-relaxed max-w-3xl text-red-50"
            dangerouslySetInnerHTML={{ __html: bioHtml }}
          />

          {/* Education Highlight Card */}
          <div 
            data-aos="fade-up" 
            data-aos-delay="250" 
            className="bg-black/25 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8 max-w-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <h3 className="text-white font-black text-lg md:text-xl tracking-tight">
                  {education.degree}
                </h3>
              </div>
              <span className="text-black font-black bg-white px-3 py-0.5 rounded-full text-xs shadow-sm uppercase tracking-wider">
                {education.cgpa}
              </span>
            </div>
            
            <p className="text-red-100 font-semibold text-sm mb-4">
              {education.institution}{education.graduation ? ` · Class of ${education.graduation}` : ''}
            </p>

            <div className="flex flex-wrap gap-3 text-xs font-mono font-bold text-white/90 pt-3 border-t border-white/10">
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {education.twelfth}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {education.tenth}
              </span>
            </div>
          </div>

          {/* Horizontal Skills Row */}
          <div className="flex items-center gap-10 mt-4">
            <div data-aos="zoom-in" data-aos-delay="300" className="hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-2xl">
              <JavaIcon />
            </div>
            <div data-aos="zoom-in" data-aos-delay="450" className="hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-2xl">
              <SpringBootIcon />
            </div>
            <div data-aos="zoom-in" data-aos-delay="600" className="hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-2xl">
              <MernIcon />
            </div>
          </div>

        </div>
      </div>

      {/* Torn paper divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-30 transform translate-y-1">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.62,189.5,99.8,242.79,81.82,282.88,63.6,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Decorative stars */}
      <div className="absolute top-10 right-10 md:right-20 text-black opacity-30 animate-pulse">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z"/></svg>
      </div>
      <div className="absolute bottom-32 left-4 md:left-20 text-black opacity-30 animate-pulse" style={{ animationDelay: '1s' }}>
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z"/></svg>
      </div>
    </section>
  );
};

export default About;
