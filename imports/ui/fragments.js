// Similar to Apollo fragments
import PropTypes from 'prop-types';

export const pageFragment = {
  createdAt: PropTypes.instanceOf(Date),
  _id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  lang: PropTypes.string,
  country: PropTypes.string,
  isCrawling: PropTypes.bool,
  isCrawled: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.string),
};
