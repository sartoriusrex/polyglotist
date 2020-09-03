const lookup = require('dns').lookup;
const promisify = require('util').promisify;

const dnsLookup = promisify(lookup);

export default async (containerName: string) => {
    const { address } = await dnsLookup(containerName);
    return address;
};