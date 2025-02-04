import React from 'react';
import Info from './Info';
import './map.css'

function Map({ showInfo, setShowInfo }) {
  return (
    <div className="box MAPP">
      {showInfo && (
        <div className="info-container">
          <Info setShowInfo={setShowInfo} />
        </div>
      )}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594655.686011312!2d81.48772452740837!3d28.376804582334014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995e8c77d2e68cf%3A0x34a29abcd0cc86de!2sNepal!5e0!3m2!1sen!2snp!4v1737380383271!5m2!1sen!2snp"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Map of Nepal"
      ></iframe>
    </div>
  );
}

export default Map;
