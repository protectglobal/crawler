/**
* @namespace AuxFunctions
*/
const AuxFunctions = {};

//------------------------------------------------------------------------------
AuxFunctions.validateUrl = (url) => {
  const re = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  return re.test(url);
};
//------------------------------------------------------------------------------
/**
* @summary Get url protocol from url.
*/
AuxFunctions.hasProtocol = url => (
  url.toLowerCase().slice(0, 4).toLowerCase() === 'http'
);
//------------------------------------------------------------------------------

export default AuxFunctions;
