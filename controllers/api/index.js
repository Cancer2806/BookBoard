const router = require('express').Router();
const userRoutes = require('./userRoutes');
const downloadsRoutes = require('./downloadsRoutes');
const favouritesRoutes = require('./favouritesRoutes');
const filesRoutes = require('./filesRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use('/users', userRoutes);
router.use('/favourite', favouritesRoutes);
router.use('/download', downloadsRoutes);
router.use('/file', filesRoutes);
router.use('/review', reviewRoutes);

module.exports = router;
