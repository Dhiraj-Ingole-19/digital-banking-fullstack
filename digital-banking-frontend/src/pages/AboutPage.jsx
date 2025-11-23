import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="modern-layout">
            {/* Reusing Navbar, but we might want a public version. 
          For now, the existing Navbar handles public/private state well enough. 
      */}
            <Navbar />

            <div className="content-wrapper" style={{ flexDirection: 'column' }}>
                <main className="page-content" style={{ marginLeft: 0, padding: 0 }}>

                    {/* Hero Section */}
                    <section style={{
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        padding: '4rem 2rem',
                        textAlign: 'center'
                    }}>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}
                        >
                            The Future of Banking is Here
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}
                        >
                            Experience seamless, secure, and smart banking with The Digital Bank.
                            We are committed to empowering your financial journey.
                        </motion.p>
                        <Link to="/register" className="btn" style={{
                            background: 'white',
                            color: 'var(--color-primary)',
                            fontWeight: 'bold',
                            padding: '1rem 2rem',
                            borderRadius: '30px'
                        }}>
                            Get Started Today
                        </Link>
                    </section>

                    {/* Features Section */}
                    <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose Us?</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <FeatureCard
                                icon={<ShieldCheck size={40} color="var(--color-success)" />}
                                title="Secure & Safe"
                                description="Top-notch security protocols to ensure your money and data are always protected."
                            />
                            <FeatureCard
                                icon={<Globe size={40} color="var(--color-primary)" />}
                                title="Global Access"
                                description="Access your account from anywhere in the world with our mobile-first platform."
                            />
                            <FeatureCard
                                icon={<Users size={40} color="#ff9a9e" />}
                                title="Customer First"
                                description="24/7 support and a user-friendly interface designed with you in mind."
                            />
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="glass-panel"
        style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center' }}
    >
        <div style={{ marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
        <p>{description}</p>
    </motion.div>
);

export default AboutPage;
