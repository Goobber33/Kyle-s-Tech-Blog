const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const User = db.User;
const { check, validationResult } = require('express-validator');
const passport = require('passport');
