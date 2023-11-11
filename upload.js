const { exec } = require('child_process');

exec('git add .', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao adicionar alterações: ${error}`);
    return;
  }

  exec('git commit -m "Upload do projeto"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao fazer commit: ${error}`);
      return;
    }

    exec('git push origin master', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao fazer push para o repositório remoto: ${error}`);
        return;
      }

      console.log('Projeto enviado para o GitHub com sucesso!');
    });
  });
});
