const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 5001;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/physicians'
}