import { createApp } from './app';

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`?? StayFix API Server running on http://localhost:${PORT}`);
  console.log(`?? Interactive Swagger Documentation: http://localhost:${PORT}/docs`);
});
