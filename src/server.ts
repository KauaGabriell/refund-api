import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT ?? 1111;

app.listen(PORT, () => {
	console.log(`Servidor Rodando em: http://localhost:${PORT}`);
});
