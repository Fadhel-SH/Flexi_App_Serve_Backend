app.use(cookieParser());

// new code below
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));