import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ employees, setEmployees ] = useState([]);
  const [ listening, setListening ] = useState(false);
  const [ formData, setFormData ] = useState({});

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:3000/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setEmployees((employees) => employees.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, employees]);

  const postData=async (e)=> {
    e.preventDefault();
     await fetch('http://localhost:3000/employee',{method:'post',headers:{"Content-Type": "application/json"}, body:JSON.stringify(formData)});
    };

    const handleChange=(e)=>{
      const {name,value}=e.target;
      setFormData((prevData)=>{
        return {...prevData,[name]:value}})
    }
  return (
    <div style={{display:'flex',justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
    <h2>Node Server Sent Events</h2>
    <h3>Error Tech Employees</h3>
    <h4>No of Employees : {employees.length}</h4>
     <form onSubmit={postData} onChange={handleChange} style={{display:'flex',justifyContent:'space-between'}}>
      <input type="text" placeholder='Name' name="name" value={formData.name} required/>
      <select  name="role" value={formData.role} required>
        <option value="">select role</option>
        <option value="React Developer">React Developer</option>
        <option value="React Native Developer">React Native Developer</option>
        <option value="NodeJS Developer">NodeJS Developer</option>
      </select>
      <button type='submit'>Submit</button>
      </form>
     
    <table className="stats-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {
          employees.map((employee, i) =>
            <tr key={i}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
            </tr>
          )
        }
      </tbody>
    </table>
      </div>
  );
}

export default App;