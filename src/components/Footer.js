import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 1.5rem;
  text-align: center;
  background: var(--bg-secondary-light);
  color: var(--text-primary-light);
  font-size: 0.9rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .dark & {
    background: var(--bg-secondary-dark);
    color: var(--text-primary-dark);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  a {
    color: #f59e0b;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;

    &:hover {
      color: #f97316;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.8rem;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <p>
        © {currentYear} Made with ❤️ by{' '}
        <a href="https://tiossanacademy.com" target="_blank" rel="noopener noreferrer">
          Tiossan Academy
        </a>{' '}
        by Magatte Wade
      </p>
    </FooterContainer>
  );
};

export default Footer; 