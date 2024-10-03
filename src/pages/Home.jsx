import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, Box, BarChart } from 'lucide-react';

const AdminLandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, title: "Manage Your Products", description: "Add, edit, and organize your clothing inventory with ease.", icon: <Box size={48} /> },
    { id: 2, title: "Track Sales Performance", description: "Get real-time insights into your best-selling items and revenue.", icon: <TrendingUp size={48} /> },
    { id: 3, title: "Analyze Your Data", description: "Make informed decisions with powerful analytics tools.", icon: <BarChart size={48} /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "#d9eaff " }}>
      <header className="container mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center gap-2">
            <ShoppingBag size={32} className="text-dark me-2" />
            <img src="/assets/NonBGLogo.png" alt="Logo" width={200} />
          </div>
          <div className="ms-auto">
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="container my-5 flex-grow-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-5"
        >
          <h2 className="display-4 fw-bold mb-3 text-primary">
            Welcome to Your <span className="text-dark">COLLETTE </span><span className="text-primary">Dashboard</span>
          </h2>
          <p className="lead text-muted">
            Manage your e-commerce clothing store with powerful tools and intuitive interfaces.
          </p>
        </motion.div>

        <div className="position-relative mb-5" style={{ height: '300px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="card h-100 border-0 shadow-sm"
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
                {slides[currentSlide].icon}
                <h3 className="card-title mt-4 mb-3">{slides[currentSlide].title}</h3>
                <p className="card-text text-muted">{slides[currentSlide].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevSlide}
            className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y shadow-sm"
            style={{ width: '3rem', height: '3rem', zIndex: 1 }}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y shadow-sm"
            style={{ width: '3rem', height: '3rem', zIndex: 1 }}
          >
            <ChevronRight />
          </button>
        </div>

        <div className="row g-4 mt-4">
          {[
            { title: "Product Management", icon: <Box size={40} className="text-primary mb-3" />, description: "Easily manage your product catalog" },
            { title: "Order Processing", icon: <ShoppingBag size={40} className="text-primary mb-3" />, description: "Streamline your order fulfillment process" },
            { title: "Analytics Dashboard", icon: <BarChart size={40} className="text-primary mb-3" />, description: "Gain insights with powerful analytics tools" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="col-md-4"
            >
              <motion.div 
                className="card h-100 border-0 shadow-sm"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-body text-center p-4">
                  {feature.icon}
                  <h3 className="card-title h5 mb-3">{feature.title}</h3>
                  <p className="card-text text-muted">{feature.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminLandingPage;
