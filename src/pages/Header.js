import React, { useEffect, useState } from 'react';

export default function Header() {
  const [vname, setVname] = useState([]);
  const [csign, setCsign] = useState([]);

  useEffect(() => {
    fetch('http://192.168.3.1:8000/api/dep/csign')
      .then((response) => response.json())
      .then((data) => {
        setCsign(data.csign.CSIGN);
        localStorage.setItem('RCSIG', data.csign.CSIGN);
      })
      .catch((err) => console.error('Ошибка загрузки CSIGN:', err));

    fetch('http://192.168.3.1:8000/api/dep/vname')
      .then((response) => response.json())
      .then((data) => {
        setVname(data.v_name.VNAME);
      })
      .catch((err) => console.error('Ошибка загрузки VNAME:', err));
  }, []);

  return (
    <div
      className="header"
      style={{
        background: 'black',
        color: 'white',
        textAlign: 'center',
        height: '40px',
        lineHeight: '40px',
        marginBottom: '10px',
      }}
    >
      {csign} {vname}
    </div>
  );
}
