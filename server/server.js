require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const subCategoriesRoute = require('./routes/subCategoriesRoutes');
const adRoutes = require('./routes/adRoutes');
const adminAdRoutes = require('./routes/adminAdRoutes');

router.get('/', (req, res) => {
    res.json({ message: 'hello' });
});

app.use('/api', adRoutes);
app.use('/api', authRoutes);
app.use('/api', adminAdRoutes);
app.use('/api', subCategoriesRoute);
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
