import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World from TypeScript, CodeBuild, and OIDC!');
});

// Only start listening if the file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

export default app;
