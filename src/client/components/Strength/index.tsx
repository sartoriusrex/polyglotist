import React from 'react';

import Skill5 from '../../images/Skill5';
import Skill4 from '../../images/Skill4';
import Skill3 from '../../images/Skill3';
import Skill2 from '../../images/Skill2';
import Skill1 from '../../images/Skill1';

const Strength = ({strength} : {strength: number}) => {
    switch (strength) {
        case 5:
          return <Skill5 />;
        case 4:
          return <Skill4 />;
        case 3:
          return <Skill3 />;
        case 2:
          return <Skill2 />;
        default:
          return <Skill1 />;
      }
}

export default Strength;