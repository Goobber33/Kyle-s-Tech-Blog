const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const sequelize = require('./Develop/config/connection');
const { v4: uuidv4 } = require('uuid');

const path = require('path');
const db = require(path.join(__dirname, 'Develop', 'models'));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop/public')));

// Handlebars
const helpers = require('./Develop/utils/helpers');
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'Develop/views'));

// Sessions
app.use(session({
  secret: uuidv4(),
  store: new SequelizeStore({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1800000 } // 30 minutes idle time before cookie expires
}));

// Authentication middleware
const authMiddleware = require('./Develop/middleware/authMiddleware');
app.use('/api', authMiddleware);

// Routes
const apiRoutes = require('./Develop/controllers/api');
const homeRoutes = require('./Develop/controllers/home');
const dashboardRoutes = require('./Develop/controllers/dashboard');
app.use('/api', apiRoutes);
app.use('/', homeRoutes);
app.use('/dashboard', dashboardRoutes);

// Start server and render main layout
app.listen(PORT, () => {
  console.log('App listening on PORT ' + PORT);
  app.get('/', (req, res) => {
    res.render('main');
  });
});

// Sync models
db.sequelize.sync({ force: false });
