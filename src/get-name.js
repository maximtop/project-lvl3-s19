import url from 'url';

export default (link, extname) => {
  const regex = /\W/g; // search all non-character symbols in links
  const sourceRegex = /-(?=[^-]*$)/; // search last '-' in the renamed link
  const urlObject = url.parse(link);
  const { hostname, pathname } = urlObject;
  const formattedLink = [hostname, pathname].join('').replace(regex, '-');
  if (extname) {
    return `${formattedLink}${extname}`;
  }
  return formattedLink.replace(sourceRegex, '.');
};
