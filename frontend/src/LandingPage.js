import React, { useState, useEffect } from 'react';
import Search from './Search';
import './LandingPage.css';

const LandingPage = ({ handleEnterSite, papers, setPapers }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const renderPapers = () => {
        if (Object.keys(papers).length === 0) {
            return <div className="no-papers-message">Search something...</div>;
        } else {
            return Object.entries(papers).map(([paperId, paperMetadata], index) => (
                <div key={paperId} className="paper" onClick={() => handleEnterSite(paperId)}>
                    <h2>{paperMetadata.title}</h2>
                    <p>{paperMetadata.authors[0]["name"]}</p>
                </div>
            ));
        }
    };

    return (
      <div className={isScrolled ? 'scrolled' : ''}>
        <div className="top-bar">
            <div className='search-container'>
                <Search setPapers={setPapers} />
            </div>
        </div>
        <div className="papers-grid">
            {renderPapers()}
        </div>
      </div>
    );
};

export default LandingPage;
