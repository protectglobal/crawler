// Similar to Apollo fragments
import PropTypes from 'prop-types';

export const pageFragment = {
  createdAt: PropTypes.instanceOf(Date),
  url: PropTypes.string,
  language: PropTypes.string,
  country: PropTypes.string,
  isCrawled: PropTypes.bool,
  links: PropTypes.arrayOf(PropTypes.string),
};
