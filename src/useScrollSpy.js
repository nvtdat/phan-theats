import { useState, useEffect } from 'react';

export default function useScrollSpy(sectionIds) {
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            let currentSection = sectionIds[0]; // Mặc định à ở Home
            for (const sectionId of sectionIds) {
                const section = document.getElementById(sectionId);
                if(section && section.offsetTop <= scrollPosition) {
                    currentSection = sectionId;
                }
            }
            setActiveSection(currentSection);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            window.removeEventListener('scroll', handleScroll);}
        }, [sectionIds]);

    return activeSection;
}
    
