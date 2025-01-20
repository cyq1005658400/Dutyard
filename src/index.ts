import { createApp } from './app';
const PORT = parseInt(process.env.PORT || '3000', 10);
async function main() {
  const app = await createApp();
  app.listen(PORT, () => console.log('Dutyard running on port ' + PORT));
}
main().catch(console.error);






















