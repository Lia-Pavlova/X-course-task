import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, config, animated } from 'react-spring';
import errImg from '../assets/error.png';
import broImg from '../assets/ups.png';

function NotFoundPage() {
  const [showBro, setShowBro] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowBro(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowPopover(true);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const broAnimation = useSpring({
    to: {
      right: showBro ? '0px' : '-190px',
      opacity: showBro ? 1 : 0,
    },
    config: config.default,
    delay: 500,
  });

  const popoverAnimation = useSpring({
    to: {
      opacity: showPopover ? 1 : 0,
      bottom: showPopover ? '300px' : '-50px',
      right: showPopover ? '150px' : '-50px',
    },
    config: config.default,
  });

  return (
    <section className="errSection">
      <img src={errImg} alt="Error 404" />
      <h1>Page is not found!</h1>
      <animated.img
        className="img-bro"
        src={broImg}
        alt="Bro"
        style={{
          ...broAnimation,
          position: 'fixed',
          bottom: '20px',
        }}
      />
      <animated.div
        className="popover"
        style={{
          ...popoverAnimation,
          position: 'fixed',
          bottom: '260px',
          right: '100px',
          background: 'rgb(224, 223, 222)',
          padding: '10px',
          borderRadius: '10px 10px 0px 10px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Hey! Wanna some{' '}
        <Link to="/books" style={{ textDecoration: 'underline', color: 'rgb(2, 136, 209)' }}>
          books
        </Link>
        ?
      </animated.div>
    </section>
  );
}

export default NotFoundPage;
