import React from 'react';
import { Container } from 'react-bootstrap';
import { Shirt, ShoppingBag, Umbrella } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{background:"#d9eaff"}}>
    <Container className="vh-100 d-flex justify-content-center align-items-center position-relative overflow-hidden">
      <div className="text-center">
        <h1 className="display-1 fw-bold animate-glitch">404</h1>
        <h2 className="mb-4 animate-fade-in">Oops! This Page Not Found</h2>
        <p className="lead animate-fade-in">
          Looks like this clothing item has gone missing from our virtual wardrobe.
        </p>
      </div>
      <Shirt className="clothing-icon shirt" size={48} />
      <ShoppingBag className="clothing-icon bag" size={48} />
      <Umbrella className="clothing-icon umbrella" size={48} />
      <div className="hanger"></div>
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-glitch {
          animation: glitch 1s infinite;
          color: #ff6b6b;
          text-shadow: 3px 3px 0 #4ecdc4, -3px -3px 0 #45b7d1;
        }
        .animate-fade-in {
          animation: fadeIn 2s;
        }
        .clothing-icon {
          position: absolute;
          animation: float 3s infinite ease-in-out;
        }
        .shirt {
          top: 10%;
          left: 10%;
          color: #4ecdc4;
        }
        .bag {
          bottom: 15%;
          right: 15%;
          color: #45b7d1;
        }
        .umbrella {
          top: 20%;
          right: 20%;
          color: #ff6b6b;
        }
        .hanger {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 6px solid #333;
          border-bottom: none;
          border-radius: 50% 50% 0 0;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          animation: swing 3s infinite ease-in-out;
        }
        .hanger::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 30px;
          background: #333;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </Container>
    </div>
  );
};

export default NotFound;