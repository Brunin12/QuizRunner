/****************************************************
 * Propriedade de BrunoSoft. Todos os direitos reservados.
 * 
 * O uso não autorizado deste código é estritamente proibido.
 * Qualquer reprodução, modificação ou distribuição sem permissão é uma violação de direitos autorais.
 ****************************************************/

const { exec } = require("child_process");
const fs = require("fs");
const { version } = require("os");

// Caminho para o arquivo package.json
const packageJsonPath = "./package.json";
let packageVersion = "1.0.0";
try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");

  const packageJson = JSON.parse(packageJsonContent);

  packageVersion = packageJson.version;
} catch (error) {
  console.error("Erro ao ler o package.json:", error.message);
}
exec("git init", (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao iniciar: ${error}`);
    return;
  }
  exec("git add .", (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao adicionar alterações: ${error}`);
      return;
    }
    exec(
      `git commit -m "Update v(${packageVersion})"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao fazer commit: ${error}`);
          return;
        }
        exec("git pull origin master", (error, stdout, stderr) => {
          if (error) {
            console.error(`Erro ao atualizar os dados: ${error}`);
            return;
          }

          exec("git push origin master", (error, stdout, stderr) => {
            if (error) {
              console.error(
                `Erro ao fazer push para o repositório remoto: ${error}`
              );
              return;
            }

            console.log("Projeto enviado para o GitHub com sucesso!");
          });
        });
      }
    );
  });
});
