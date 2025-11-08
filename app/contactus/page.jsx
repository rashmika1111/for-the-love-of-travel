'use client'

import { useState } from 'react';
import Navbar from '../../components/Navbar.jsx'
import HeroSection from '../../components/HeroSection.jsx'
import { ArrowRight } from 'lucide-react'
import Footer from '../../components/Footer.jsx'
import { contactApi } from '../../lib/api'
import toast from 'react-hot-toast'

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            await contactApi.submitContact({
                name: formData.name,
                email: formData.email,
                subject: formData.subject || 'Contact Form Submission',
                message: formData.message
            });
            
            toast.success('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        } catch (error) {
            console.error('Contact form submission error:', error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
 
    return (
        <div>
            <Navbar />
            
            {/* Main Container */}
            <div 
                className="container"
                style={{
                    width: '100%',
                    maxWidth: '1800px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    marginLeft: '10px',
                    marginRight: '20px',
                    marginTop: '-50px'
                }}
            >
                <HeroSection title="Contact Us" />

            {/* Contact Form Section */}
            <div className="contact-form-section" style={{
                width: '100%',
                maxWidth: '2550.5px',
                minHeight: '749px',
                opacity: 1,
                gap: '10px',
                paddingTop: '40px',
                paddingBottom: '88px',
                background: 'linear-gradient(102.91deg, rgba(247, 236, 213, 0.65) 1.8%, rgba(238, 201, 249, 0.65) 99.54%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '100px',
                marginBottom: '50px',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {/* Form Title */}
                    <h2 className="form-title" style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        color: '#333',
                        textAlign: 'center',
                        marginTop: '40px',
                        marginBottom: '20px'
                    }}>
                        Get in Touch
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Name and Email Row (Parallel on desktop, stacked on mobile) */}
                        <div className="form-row form-grid" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '20px',
                            width: '100%',
                            marginBottom: '24px'
                        }}>
                            {/* Name Field */}
                            <div style={{ flex: 1 }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                    onFocus={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.borderColor = '#3514EE';
                                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                />
                            </div>

                            {/* Email Field */}
                            <div style={{ flex: 1 }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    color: '#333'
                                }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        outline: 'none',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                    onFocus={(e) => {
                                        if (!isSubmitting) {
                                            e.target.style.borderColor = '#3514EE';
                                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                        }
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Subject Field */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject (optional)"
                                value={formData.subject}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                                onFocus={(e) => {
                                    if (!isSubmitting) {
                                        e.target.style.borderColor = '#3514EE';
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            />
                        </div>

                        {/* Message Field */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                Message *
                            </label>
                            <textarea
                                name="message"
                                placeholder="Your message here..."
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    resize: 'vertical',
                                    minHeight: '120px',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                                onFocus={(e) => {
                                    if (!isSubmitting) {
                                        e.target.style.borderColor = '#3514EE';
                                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            />
                        </div>

                        {/* Send Message Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button"
                            style={{
                                background: isSubmitting ? '#6b7280' : '#3514EE',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px 32px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                alignSelf: 'flex-start',
                                marginTop: '10px',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) {
                                    e.target.style.background = '#2a0fc7';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(53, 20, 238, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSubmitting) {
                                    e.target.style.background = '#3514EE';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <Footer />

            {/* Mobile-specific CSS */}
            <style jsx>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                .card-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    
                }
                
                @media (max-width: 768px) {
                    .contact-form-section {
                        padding-left: 20px !important;
                        padding-right: 20px !important;
                    }
                    
                    .form-title {
                        font-size: 2rem !important;
                    }
                    
                    .form-row {
                        flex-direction: column !important;
                    }
                    
                    .submit-button {
                        align-self: stretch !important;
                        width: 100% !important;
                        padding: 14px 24px !important;
                        font-size: 1rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .contact-form-section {
                        padding-left: 16px !important;
                        padding-right: 16px !important;
                        padding-top: 60px !important;
                        padding-bottom: 60px !important;
                    }
                    
                    .form-title {
                        font-size: 1.75rem !important;
                        margin-bottom: 16px !important;
                    }
                }
            `}</style>
            </div>
        </div>
    );
}