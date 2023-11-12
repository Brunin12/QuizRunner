const { exec } = require("child_process");
const fs = require("fs");
const { version } = require("os");

// Caminho para o arquivo package.json
const packageJsonPath = './package.json';
try {

  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");

  const packageJson = JSON.parse(packageJsonContent);

  const version = packageJson.version;
} catch (error) {
  console.error("Erro ao ler o package.json:", error.message);
}

exec("git add .", (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao adicionar alterações: ${error}`);
    return;
  }

  exec(`git commit -m "Update v${version}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao fazer commit: ${error}`);
      return;
    }

    exec("git push origin master", (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao fazer push para o repositório remoto: ${error}`);
        return;
      }

      console.log("Projeto enviado para o GitHub com sucesso!");
    });
  });
});
