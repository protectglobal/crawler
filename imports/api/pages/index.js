import extend from 'lodash/extend';
import collection from './collection';

/**
 * @namespace Pages
 * @summary defines utilities related to Page entities.
 */
const Pages = {};

// Load client-only or client-server utilities if any
extend(Pages, { collection });

// Load server-only utilities

export default Pages;
