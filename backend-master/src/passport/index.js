import passport from 'passport';
import local from './strategies/local.strategy';

module.exports = () => {
  passport.use(local);
};