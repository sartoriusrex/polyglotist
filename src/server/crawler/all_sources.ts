interface sourceArrayInterface {
  url: string;
  name: string;
  language: string;
}

const sources: sourceArrayInterface[] = [
  {
    url: 'https://www.lefigaro.fr/',
    name: 'figaro',
    language: 'french',
  },
  {
    url: 'https://www.20minutes.fr/',
    name: 'twenty',
    language: 'french',
  },
  {
    url: 'https://www.lemonde.fr/',
    name: 'monde',
    language: 'french',
  },
  // {
  //   url: 'http://www.leparisien.fr/',
  //   name: 'parisien',
  //   language: 'french',
  // },
  {
    url: 'https://www.20minutos.com/',
    name: 'veinte',
    language: 'spanish',
  },
  // {
  //   url: 'https://www.bbc.com/mundo',
  //   name: 'bbc',
  //   language: 'spanish',
  // },
  // {
  //   url: 'https://www.elmundo.es/',
  //   name: 'mundo',
  //   language: 'spanish',
  // },
  {
    url: 'https://elpais.com/america/',
    name: 'pais',
    language: 'spanish',
  },
  //   {
  //     url: 'https://www.welt.de/',
  //     name: 'welt',
  //     language: 'german',
  //   },
  //   {
  //     url: 'https://www.faz.net/aktuell/',
  //     name: 'faz',
  //     language: 'german',
  //   },
  //   {
  //     url: 'https://www.sueddeutsche.de/',
  //     name: 'sz',
  //     language: 'german',
  //   },
  //   {
  //     url: 'https://www.spiegel.de/',
  //     name: 'spiegel',
  //     language: 'german',
  //   },
];

export default sources;
