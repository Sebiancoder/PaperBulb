import React from 'react';
import Search from './Search';
import './LandingPage.css';
import paperbulb from './paperbulb.svg';

const LandingPage = ({ handleEnterSite, papers, setPapers }) => {
    const renderPapers = () => {
        if (Object.keys(papers).length === 0) {
            return null; // return null if you don't want to display any papers
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

        {Object.keys(papers).length === 0 && (
                <div className="no-papers-message">
                    <p className="info-text">           
                        <img src={paperbulb} className="logo" alt="PaperBulb logo"/> is a learning tool for budding researchers. Focused on making literature review approachable, PaperBulb 
                        displays the lineage of an idea and the context of a paper in a graph timeline. It simplifies the process of
                        finding relevant papers, understanding their content, and discovering new ideas.
                        Search for a paper to get started!
                    </p>
                </div>
            )}

        <div className="papers-grid">
            {renderPapers()}
        </div>
      </div>
    );
};

export default LandingPage;


