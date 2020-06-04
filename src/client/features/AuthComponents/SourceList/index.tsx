import React from 'react';

import styles from './sourceList.module.scss';

interface sourceArrayInterface {
  name: string;
  id: string;
  desc: string;
}

export const sources: {
  [key: string]: sourceArrayInterface[];
} = {
  french: [
    {
      name: 'Le Figaro',
      id: 'figaro',
      desc:
        'One of the oldest French newspapers still in print. Challenging, with center-right bias.',
    },
    {
      name: '20 Minutes',
      id: 'twenty',
      desc:
        'Free, daily newspaper, most popular by print. Heavier on gossip and popular culture. Short, digestable, and accessible to all audiences. Neutral bias.',
    },
    {
      name: 'Le Monde',
      id: 'monde',
      desc:
        'One of the most widely respected newspapers in the world, covering every topic. Intellectual and almost academic. Challenging, with center-left bias.',
    },
    // {
    //   name: 'Le Parisien',
    //   id: 'parisien',
    //   desc:
    //     'National, International, and Paris metro-area news. Intermediate skill, with neutral bias.',
    // },
  ],
  spanish: [
    {
      name: '20 Minutos',
      id: 'veinte',
      desc:
        'A beginner to lower-intermediate level selection of articles selected for a US audience (20minutos Estados Unidos edition).',
    },
    // {
    //   name: 'BBC Mundo',
    //   id: 'bbc',
    //   desc:
    //     'All topics at all levels available, and a favorite for developing breadth on vocabularly and improving. The website itself also has video sections specifically for improving listening.',
    // },
    // {
    //   name: 'El Mundo',
    //   id: 'mundo',
    //   desc:
    //     'Second most popular, known for its coverage of the Economy and International News, as well as culture. Center-right bias.',
    // },
    {
      name: 'El Pais',
      id: 'pais',
      desc:
        'Most popular and widely read, with four worldwide versions available (but only the version for Spain here). Good for all levels, with center-left bias. ',
    },
  ],
  // german: [
  //   {
  //     name: 'Die Welt',
  //     id: 'welt',
  //     desc: 'Large German weekly newspaper, with conservative, right bias.',
  //   },
  //   {
  //     name: 'Frankfurter Allgemeine Zeitung',
  //     id: 'faz',
  //     desc:
  //       'One of the most widely-read German newspapers read both domestically and abroad, with center-right and liberal-conservative bias.',
  //   },
  //   {
  //     name: 'Suddeutsche Zeitung',
  //     id: 'sz',
  //     desc:
  //       'Most popular daily newspaper throughout Germany, with center-left and liberal bias.',
  //   },
  //   {
  //     name: 'Der Spiegel',
  //     id: 'spiegel',
  //     desc:
  //       'Largest German National weekly magazine, famous for its investigative journalism.',
  //   },
  // ],
};

const SourceList = (props: {
  lang: string;
  handleChange: Function;
  resources: string[];
  setResources: Function;
}) => {
  const { lang, handleChange, resources, setResources } = props;

  return (
    <div className={styles.sourceListContainer}>
      <h4>{`${lang.charAt(0).toUpperCase() + lang.slice(1)} Sources`}</h4>
      <p id='desc-targetSources'>Choose at least one source.</p>
      <ul aria-describedby='desc-targetSources' className={styles.sourceList}>
        {sources[lang].map(
          (src: { id: string; name: string; desc: string }) => {
            const { id, name, desc } = src;
            return (
              <li key={id}>
                <label
                  htmlFor={`${id}`}
                  className={
                    resources.includes(id)
                      ? styles.labelActive
                      : styles.labelInactive
                  }
                >
                  {name}
                  <input
                    type='checkbox'
                    id={`${id}`}
                    name={`${id}`}
                    defaultChecked={resources.includes(id)}
                    onChange={() => handleChange(id, resources, setResources)}
                    aria-describedby={`desc-${id}`}
                  />
                </label>
                <p id={`desc-${id}`}>{desc}</p>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

export default SourceList;
