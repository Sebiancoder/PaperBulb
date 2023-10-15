import React from 'react';
import Search from './Search';
import './LandingPage.css';

const LandingPage = ({ handleEnterSite, papers, setPapers }) => {
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
