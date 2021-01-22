import React from 'react';

const ChevronUp = ({change} : {change?: number}) => {
  let fill = change && change === -1 ?
      '#B20000' :
      '#147D64';
      

  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17.6569 16.2427L19.0711 14.8285L12 7.75739L4.92892 14.8285L6.34314 16.2427L12 10.5858L17.6569 16.2427Z'
        fill={fill}
      />
    </svg>
  );
};

export default ChevronUp;
