export default function HeroSection({ title = "Destination" }) {
  return (
    <>
      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          max-width: 1448px;
          height: 607px;
          margin: 0 auto;
          opacity: 1;
          border-bottom-right-radius: 86px;
          border-bottom-left-radius: 86px;
          overflow: hidden;
          background-image: linear-gradient(180deg, rgba(0,0,0,0) -2.14%, rgba(0,0,0,0.55) 64.58%), url('/header.jpg');
          background-size: cover;
          background-position: center;
        }
        
        .hero-title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          font-size: 4rem;
          font-weight: bold;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
        
        @media (max-width: 1024px) {
          .hero-section {
            height: 500px;
            border-bottom-right-radius: 60px;
            border-bottom-left-radius: 60px;
          }
          
          .hero-title {
            font-size: 3rem;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            height: 400px;
            border-bottom-right-radius: 40px;
            border-bottom-left-radius: 40px;
            margin: 0 1rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
            padding: 0 1rem;
            top: 60%;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            height: 300px;
            border-bottom-right-radius: 20px;
            border-bottom-left-radius: 20px;
            margin: 0 0.5rem;
            right:20px;
          }
          
          .hero-title {
            font-size: 2rem;
            padding: 0 0.5rem;
            top: 65%;
          }
        }
      `}</style>
      <div className="hero-section">

      {/* Travel Icon 
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '25px'
      }}>
        <img 
          src="/icon.png" 
          alt="Travel Icon" 
          style={{
            width: '128px',
            height: '48px',
            opacity: 1
          }}
        />
      </div>
*/}

        {/* Destination Title - Centered */}
        <div className="hero-title">
          <h1>
            {title}
          </h1>
        </div>     
      </div>
    </>
  );
}