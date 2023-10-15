import React from 'react';
import Search from './Search';
import './LandingPage.css';
import paperbulb from './paperbulb.svg';

const LandingPage = ({ handleEnterSite, papers, setPapers }) => {
    const renderPapers = () => {
        if (Object.keys(papers).length === 0) {
            return (
                <div className="no-papers-message">
                    <div className="logo-and-info">
                        <img src={paperbulb} alt="PaperBulb logo" className="logo"/>
                        <div className="info-text">
                            <p> is a learning tool for budding researchers. Focused on making literature review approachable, PaperBulb ...</p>
                        </div>
                    </div>
                </div>)
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
      <div>
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
