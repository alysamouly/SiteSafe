import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Shield, Camera, AlertTriangle, FileWarning } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BRAND_NAME = "SiteSafe AI Inspector";
const HERO_HEADING_1 = "Analyze your";
const HERO_HEADING_2 = "Construction Site.";

const PROTOCOL_STEPS = [
    {
        step: "01",
        title: "Capture Site Context",
        desc: "Take a photo before approaching an active work area on the construction site."
    },
    {
        step: "02",
        title: "Algorithmic Hazard Detection",
        desc: "Our computer vision models instantly parse structural anomalies, PPE compliance, and OSHA standard deviations."
    },
    {
        step: "03",
        title: "Review Safety Briefing",
        desc: "Read identified safety hazards and their severity levels. Keep them top of mind while navigating the site."
    }
];

const MagneticButton = ({ children, className = "", variant = "primary", onClick }: any) => {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;

        const hHover = gsap.context(() => {
            btn.addEventListener("mouseenter", () => {
                gsap.to(btn, { scale: 1.03, duration: 0.4, ease: "power3.out" });
                const bg = btn.querySelector('.btn-bg');
                if (bg) gsap.to(bg, { y: '0%', duration: 0.3, ease: "power2.out" });
            });
            btn.addEventListener("mouseleave", () => {
                gsap.to(btn, { scale: 1, duration: 0.4, ease: "power3.out" });
                const bg = btn.querySelector('.btn-bg');
                if (bg) gsap.to(bg, { y: '100%', duration: 0.3, ease: "power2.in" });
            });
        }, btn);
        return () => hHover.revert();
    }, []);

    const baseStyle = "relative overflow-hidden inline-flex items-center justify-center px-6 py-3 rounded-full font-heading font-bold text-sm tracking-wide transition-colors z-10";
    const variants = {
        primary: "bg-accent text-paper",
        nav: "bg-dark text-paper",
        outline: "border border-dark text-dark"
    };

    return (
        <button ref={btnRef} onClick={onClick} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>
            <span className="btn-bg absolute top-0 left-0 w-full h-full bg-dark translate-y-[100%] z-[-1]" />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};

const Navbar = () => {
    const navRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                start: 'top -50',
                end: 99999,
                toggleClass: { className: 'nav-scrolled', targets: navRef.current }
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <nav ref={navRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 rounded-full w-[90%] max-w-5xl transition-all duration-500 text-paper border border-transparent [&.nav-scrolled]:bg-background/80 [&.nav-scrolled]:backdrop-blur-xl [&.nav-scrolled]:text-dark [&.nav-scrolled]:border-dark/10 [&.nav-scrolled]:shadow-sm">
            <div className="font-heading font-black text-lg tracking-tight uppercase flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {BRAND_NAME}
            </div>
            <div className="hidden md:flex items-center gap-8 font-data text-xs font-bold uppercase tracking-widest">
                <a href="#protocol" className="hover:-translate-y-[1px] transition-transform">Protocol</a>
            </div>
            <div>
                <MagneticButton variant="primary" className="py-2 px-5 text-xs" onClick={() => navigate('/dashboard')}>Commence Scan</MagneticButton>
            </div>
        </nav>
    );
};

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".hero-elem",
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out", delay: 0.2 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-[100dvh] w-full bg-dark overflow-hidden flex items-end pb-24 px-8 md:px-16 lg:px-24">
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero-construction.png"
                    alt="Construction Site Crane or Excavator"
                    className="w-full h-full object-cover opacity-60 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl">
                <div className="hero-elem font-heading text-xl md:text-2xl font-bold text-paper mb-2 uppercase tracking-widest">{HERO_HEADING_1}</div>
                <h1 className="hero-elem font-drama italic text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] text-paper mb-8 tracking-tighter">
                    {HERO_HEADING_2}
                </h1>
                <div className="hero-elem flex flex-wrap items-center gap-4">
                    <MagneticButton variant="primary" className="text-lg px-8 py-4" onClick={() => navigate('/dashboard')}>
                        Commence Scan <ArrowRight className="w-5 h-5 ml-1" />
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
};

const ProtocolSteps = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card') as Element[];

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                ScrollTrigger.create({
                    trigger: card,
                    start: "top top",
                    endTrigger: ".protocol-container",
                    end: "bottom bottom",
                    pin: true,
                    pinSpacing: false,
                });

                gsap.to(card, {
                    scale: 0.8,
                    opacity: 0,
                    filter: "blur(10px)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: cards[i + 1],
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    }
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="protocol" ref={containerRef} className="protocol-container relative pb-[50px] bg-background">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center p-8 z-0">
                <div className="font-heading font-black text-[12vw] leading-none text-dark/[0.03] uppercase select-none">Protocol</div>
                <div className="font-heading font-black text-[12vw] leading-none text-dark/[0.03] uppercase select-none">System</div>
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto mt-[-100vh]">
                {PROTOCOL_STEPS.map((step, idx) => (
                    <div key={idx} className="protocol-card h-[100vh] flex items-center justify-center pt-20">
                        <div className="w-full bg-paper border border-dark/10 rounded-[3rem] p-12 shadow-xl flex flex-col md:flex-row gap-12 items-center">

                            <div className="w-48 h-48 rounded-full border border-dark/20 flex items-center justify-center relative bg-white shrink-0">
                                {idx === 0 && (
                                    <Camera className="w-16 h-16 text-dark opacity-80" />
                                )}
                                {idx === 1 && (
                                    <div className="w-full flex justify-center items-center overflow-hidden px-8">
                                        <div className="w-full h-1 bg-dark/20 relative rounded">
                                            <div className="absolute top-0 left-0 h-full w-1/3 bg-accent animate-[ping_2s_linear_infinite]" />
                                        </div>
                                    </div>
                                )}
                                {idx === 2 && (
                                    <AlertTriangle className="w-16 h-16 text-accent opacity-90" />
                                )}
                                <div className="absolute top-0 right-0 w-full h-full animate-[spin_10s_linear_infinite] pointer-events-none rounded-full border border-dashed border-dark/20" />
                            </div>

                            <div>
                                <div className="font-data text-accent font-bold text-xl mb-4">{step.step}</div>
                                <h3 className="font-heading font-bold text-4xl mb-4 uppercase tracking-tight">{step.title}</h3>
                                <p className="font-data text-dark/70 leading-relaxed max-w-md">
                                    {step.desc}
                                </p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const DisclaimerSection = () => {
    return (
        <section className="py-12 px-6 relative z-10 bg-background">
            <div className="max-w-3xl mx-auto text-center p-8 border border-accent/20 bg-accent/5 rounded-2xl">
                <FileWarning className="w-8 h-8 text-accent mx-auto mb-4" />
                <p className="font-data text-sm text-dark/70 leading-relaxed">
                    <strong>Disclaimer:</strong> This system supplements manual safety checks. It does not guarantee identification of all hazards. Personnel must maintain situational awareness and remain cautious at all times while on site.
                </p>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-dark text-paper rounded-t-[4rem] px-8 md:px-16 pt-24 pb-12 mt-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 border-b border-paper/10 pb-16">

                <div className="max-w-sm">
                    <div className="font-heading font-black text-2xl tracking-tight uppercase flex items-center gap-2 mb-6">
                        <Shield className="w-6 h-6 text-accent" />
                        {BRAND_NAME}
                    </div>
                    <p className="font-data text-sm text-paper/60 leading-relaxed mb-8">
                        The standard for autonomous AI compliance and diagnostic telemetry. Engineered for scale, built for safety.
                    </p>
                    <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 font-data text-xs uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite]" />
                        System Operational
                    </div>
                </div>

                <div className="flex gap-16 font-data text-sm uppercase tracking-widest">
                    <div className="flex flex-col gap-4">
                        <span className="text-paper/40 mb-2">Legal</span>
                        <Link to="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-accent transition-colors">Terms</Link>
                        <Link to="/security" className="hover:text-accent transition-colors">Security</Link>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center font-data text-xs uppercase tracking-widest text-paper/40">
                <div>© {new Date().getFullYear()} {BRAND_NAME}</div>
                <div>All Systems Normal.</div>
            </div>
        </footer>
    );
};

export default function LandingPage() {
    return (
        <div className="w-full relative">
            <Navbar />
            <Hero />
            <ProtocolSteps />
            <DisclaimerSection />
            <Footer />
            <div className="noise-overlay" />
        </div>
    );
}
