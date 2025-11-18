import React from "react";

const FooterDonate = () => {
  const handleDonate = () => {
    // Redirige a Stripe Checkout (tu URL de pago)
    window.location.href = "https://buy.stripe.com/test_4gMcN5fTqf1Rdhr8hP1RC00"; 
  };

  return (
    <footer
      className="text-center p-4 mt-5"
      style={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #ddd" }}
    >
      <h5 className="fw-bold mb-2">❤️ Apoya AdoptApp</h5>
      <p className="mb-3">Tu donación ayuda a rescatar y alimentar animales.</p>

      <button
        className="btn btn-primary px-4 py-2"
        onClick={handleDonate}
      >
        Donar con Tarjeta 💳
      </button>
    </footer>
  );
};

export default FooterDonate;