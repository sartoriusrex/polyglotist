import React from 'react';

import './logo.scss';

const Logo = (
  { landingStyle }: { landingStyle: boolean },
  { isTop }: { isTop: boolean }
) => {
  return (
    <svg
      className={landingStyle ? 'logo-landing-green' : ''}
      width='165'
      height='165'
      viewBox='0 0 43.65625 43.65625'
      version='1.1'
      id='svg8'
    >
      <defs id='defs2'>
        <rect
          x='74.839012'
          y='76.107468'
          width='25.749695'
          height='35.897358'
          id='rect841'
        />
      </defs>
      <metadata id='metadata5'></metadata>
      <g id='layer1'>
        <g id='g872' transform='translate(-66.296326,-63.861945)'>
          <circle
            r='21.166666'
            cy='85.690071'
            cx='88.124451'
            id='path837'
            className='logo-circle-1'
          />
          <g
            className='logo-g-1'
            id='text839'
            transform='translate(1.1416121,-12.684579)'
            aria-label='P'
          >
            <path
              className='logo-path-1'
              id='path1474'
              d='m 76.938871,101.10113 q 1.319388,-0.23989 1.739193,-0.68968 0.419806,-0.479775 0.419806,-1.769177 l 0.02999,-12.594162 q 0,-0.959555 -0.239889,-1.289402 -0.209903,-0.329847 -0.869597,-0.329847 -0.299861,0 -0.599722,0.02999 -0.299861,0.02999 -0.419805,0.02999 l -0.05997,-0.119944 0.209902,-1.319389 q 0.359834,0.02999 1.349375,0.05997 0.989541,0.02999 1.979082,0.02999 0.929569,0 2.099027,-0.02999 1.199444,-0.05997 1.679222,-0.08996 3.118554,0 4.76779,1.379361 1.649235,1.37936 1.649235,3.958165 0,1.679221 -0.989541,3.208512 -0.959555,1.499305 -2.548819,2.428875 -1.589263,0.929569 -3.328457,0.929569 h -2.518832 l -0.05997,2.938637 q 0,1.439333 0.08996,2.069041 0.08996,0.599725 0.329847,0.809625 0.269875,0.17992 0.899583,0.17992 0.509764,0 0.959555,-0.03 0.479778,-0.03 0.659695,-0.06 l 0.05997,0.11994 -0.269875,1.37936 q -0.299861,-0.03 -1.109486,-0.06 -0.779638,-0.03 -1.649235,-0.03 -1.199444,0 -2.818694,0.09 -1.589263,0.09 -1.649235,0.14993 z m 7.586483,-7.496522 q 1.799166,-0.299861 2.698749,-1.469319 0.929569,-1.169458 0.929569,-3.208512 0,-2.30893 -1.379361,-3.358443 -1.349374,-1.0795 -4.258026,-1.0795 -0.53975,0 -0.659694,0.05997 -0.119944,0.05997 -0.149931,0.359833 -0.269874,3.808235 -0.359833,8.246178 z'
            />
          </g>
          <g className='logo-g-2' id='text847' aria-label='g'>
            <path
              className='logo-path-2'
              id='path1477'
              d='m 98.061741,84.957241 q -0.502707,0.07937 -2.275413,0.238124 l -0.105834,0.132292 q 1.058332,1.164165 1.058332,2.698746 0,1.269999 -0.714374,2.354789 -0.687915,1.08479 -1.878539,1.719789 -1.190623,0.608541 -2.619372,0.608541 -0.76729,0 -1.481664,-0.211666 -0.608541,0.343958 -0.873124,0.634999 -0.264583,0.291041 -0.264583,0.582083 0,0.608541 0.820207,0.846665 0.820207,0.238125 2.566455,0.449791 1.71979,0.211667 2.778122,0.449791 1.058332,0.211667 1.825622,0.793749 0.767291,0.582083 0.767291,1.613957 0,1.164165 -0.952499,2.248959 -0.92604,1.08479 -2.460622,1.74624 -1.508123,0.68792 -3.122079,0.68792 -1.878539,0 -2.96333,-0.9525 -1.058332,-0.92604 -1.058332,-2.566454 0.370417,-0.476249 1.058332,-1.111249 0.714374,-0.634999 1.56104,-1.269998 v -0.15875 q -1.375832,-0.238125 -2.116664,-0.899582 -0.740832,-0.661458 -0.767291,-1.693331 1.031874,-0.978957 2.222498,-1.693331 v -0.105834 q -0.926041,-0.529166 -1.455207,-1.402289 -0.502708,-0.899583 -0.502708,-2.010831 0,-1.296457 0.661458,-2.381247 0.687916,-1.111249 1.799164,-1.772706 1.137707,-0.661458 2.460622,-0.661458 0.608541,0 1.508123,0.15875 0.661458,0.132292 1.08479,0.132292 1.190624,-0.132292 3.651246,-0.793749 l 0.07937,0.105833 z m -5.926659,6.588116 q 1.217082,0 1.904998,-0.767291 0.714374,-0.76729 0.714374,-2.116664 0,-1.534581 -0.846666,-2.48708 -0.846665,-0.952498 -2.196039,-0.952498 -1.217081,0 -1.931455,0.793748 -0.687916,0.793749 -0.687916,2.143123 0,1.508123 0.846665,2.460622 0.846666,0.92604 2.196039,0.92604 z m -1.269998,5.159369 q -0.793749,0.555624 -1.217082,1.217081 -0.423333,0.687916 -0.423333,1.349374 0,0.899579 0.767291,1.428749 0.767291,0.55562 2.037289,0.55562 1.005415,0 1.904998,-0.37041 0.92604,-0.34396 1.481664,-0.952502 0.555625,-0.608541 0.555625,-1.296457 0,-0.529166 -0.396875,-0.846665 -0.396874,-0.3175 -1.481665,-0.555624 -1.058332,-0.238125 -3.227912,-0.529166 z'
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Logo;