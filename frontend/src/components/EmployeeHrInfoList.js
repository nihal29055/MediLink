import React, { useEffect, useState } from 'react';

const EmployeeHrInfoList = () => {
  const [hrInfoList, setHrInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHrInfo = async () => {
      try {
        const response = await fetch('/api/staff/hrinfo');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHrInfoList(data);
      } catch (err) {
        setError(err);
        console.error("Failed to fetch employee HR info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHrInfo();
  }, []);

  if (loading) {
    return <div>Loading employee HR information...</div>;
  }

  if (error) {
    return <div>Error loading employee HR information: {error.message}</div>;
  }

  if (hrInfoList.length === 0) {
    return <div>No employee HR information found.</div>;
  }

  return (
    <div>
      <h2>Employee HR Information</h2>
      <table>
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Salary</th>
            <th>Job Title</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {hrInfoList.map((hrInfo) => (
            <tr key={hrInfo._id}>
              <td>{hrInfo.staff ? hrInfo.staff.name : 'N/A'}</td>
              <td>{hrInfo.salary}</td>
              <td>{hrInfo.jobTitle}</td>
              <td>{hrInfo.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeHrInfoList;