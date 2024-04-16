import React, { useState, useEffect, useRef } from 'react';
import './Table.css'; // Import CSS file for styling
import { dummyData } from '../data/dummyData'; // Import dummy data

const Table = () => {
  const [colleges, setColleges] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleRows, setVisibleRows] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');

  const observer = useRef(null);

  useEffect(() => {
    setColleges(dummyData);
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (colleges.length > visibleRows) {
      observer.current.observe(document.querySelector('.table-end'));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [colleges, visibleRows]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
    }
  };

  const handleSort = (key) => {
    const sortedColleges = [...colleges].sort((a, b) => {
      if (key === 'cdRank') {
        const order = sortOrder === 'desc' ? 1 : -1;
        return a[key] > b[key] ? order : -order;
      } else if (key === 'fees') {
        setSortOrder('desc');
        return a.fees.btechCSE > b.fees.btechCSE ? -1 : 1; // Sort fees in descending order
      } else if (key === 'feesLowest') {
        setSortOrder('asc');
        return a.fees.btechCSE > b.fees.btechCSE ? 1 : -1; // Sort feesLowest in ascending order
      } else if (key === 'userReviews') {
        setSortOrder('desc');
        return a.userReviews.Reviews > b.userReviews.Reviews ? -1 : 1; // Sort userReviews in descending order
      } else if (sortBy === key) {
        const order = sortOrder === 'desc' ? 1 : -1;
        return a[key] > b[key] ? order : -order;
      } else {
        setSortOrder('desc');
        return b[key] > a[key] ? 1 : -1; 
      }
    });
    setColleges(sortedColleges);
    setSortBy(key);
  };
  

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <input className="search-input" type="text" placeholder="Search by college name" onChange={handleSearch} />
        <i className="fas fa-search search-icon"></i><br/>
        <div className="sort-options">
  <span>Sort By</span>
  <label>
    <input type="radio" name="sortOption" value="cdRank" onChange={() => handleSort('cdRank')} />
    CollegeDunia Rating
  </label>
  <label>
    <input type="radio" name="sortOption" value="userReviews" onChange={() => handleSort('userReviews')} />
    User Reviews
  </label>
  <label>
    <input type="radio" name="sortOption" value="fees" onChange={() => handleSort('fees')} />
    Highest Fees
  </label>
  <label>
    <input type="radio" name="sortOption" value="feesLowest" onChange={() => handleSort('feesLowest')} />
    Lowest Fees
  </label>
</div>

      </div>
      <br/>
      <table className="college-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('cdRank')}>CD Rank</th>
            <th onClick={() => handleSort('name')}>Colleges</th>
            <th onClick={() => handleSort('fees')}>Course Fees</th>
            <th onClick={() => handleSort('placement')}>Placement</th>
            <th onClick={() => handleSort('userReviews')}>User Reviews</th>
            <th onClick={() => handleSort('ranking')}>Ranking</th>
          </tr>
        </thead>
        <tbody>
          {filteredColleges.slice(0, visibleRows).map((college) => (
            <tr key={college.id} className={college.featured ? 'featured-row' : ''}>
              <td>{'#'}{college.cdRank}</td>
              <td className="college-cell">
              <div className="college-details">
    <img src={college.logo} alt="College Logo" className="college-logo" />
    {college.featured && <img src="https://images.collegedunia.com/public/asset/img/featured-flag.svg" alt="Featured" className="featured-flag" />}
    <span className="college-name">{college.name}</span>
  </div>
  <div className="other-details">
    <div>
      <span>{college.location} | </span>
      <span>{college.accreditation}</span>
    </div>
    <div>
      <span>{college.courses[0].name}</span>
      <div>{college.courses[0].cutoff}</div>
      <div className="college-links">
  <button style={{color:"rgb(234 84 12)"}}>
    {college.courses[0].applyNowLink} <i className="fas fa-arrow-right"></i>
  </button>
  <button  style={{color:"rgb(16 77 116)"}}>
    {college.courses[0].brochureLink} <i className="fas fa-download"></i>
  </button>
  <button  style={{color:"rgb(59 128 78)"}}>
    {college.courses[0].compareLink} <i className="fas fa-box-open"></i>
  </button>
</div>

    </div>
  </div>
</td>

              <td >
                <div>
                  <div className='second-col'>{college.fees.btechCSE}</div>
                  <div className="table-cell">BE/B.Tech</div>
                  <div className="table-cell"> - 1st Year Fees</div>
                  <div>
                  <button className="compare-button">
  Compare Fees <i className="fas fa-chart-line"></i>
</button>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div>
                  <div  className='second-col'>{college.placement.averagePackage}</div>
                  <div>Average</div>
                  <div  className='second-col'>{college.placement.highestPackage}</div>
                  <div>Highest</div>
                  <div>
                  <button className="compare-button">
  Compare Placement <i className="fas fa-chart-line"></i>
</button>

                  </div>
                </div>
              </td>
              <td>
                <div   className='second-col'>{college.userReviews.Reviews}</div>
                
                <div className="table-cell">Based on {college.userReviews.users} users</div>
              </td>
              <td  className="second-col">{college.ranking}</td>
            </tr>
          ))}
          <tr className="table-end"></tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
