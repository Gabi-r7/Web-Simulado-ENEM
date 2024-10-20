# **Web Simulado ENEM - Projeto de Preparação para o Exame Nacional do Ensino Médio**

## Sobre o Projeto: 
Este repositório contém o código-fonte de um site que simula o Exame Nacional do Ensino Médio (ENEM), criado com o objetivo de ajudar os estudantes a se prepararem para a prova. O projeto permite a escolha de áreas de conhecimento específicas e apresenta um gabarito interativo ao final, destacando as respostas corretas e erradas, facilitando o aprendizado e o treinamento.

### Funcionalidades:
- Simulação de Provas: Os usuários podem escolher as áreas que desejam praticar (Matemática, Ciências Humanas, Linguagens, entre outras).
- Autenticação de Usuários: Sistema de login e cadastro com perfis personalizados.
- Ranking: Comparação de desempenho entre usuários, promovendo uma competição saudável.
- Gabarito Interativo: Visualização das respostas corretas e erradas após o teste.
- Interface Intuitiva: Design simples e focado na experiência do usuário.

### Tecnologias Utilizadas:
- Node.js: Plataforma para execução do back-end, garantindo alta performance e escalabilidade.
- Express.js: Framework para gerenciar as rotas e requisições.
- TypeScript: Linguagem de programação que adiciona tipagem estática ao JavaScript, garantindo segurança e consistência.
- Prisma: ORM utilizado para interagir com o banco de dados MySQL, facilitando a manipulação de dados.
- MySQL: Banco de dados relacional utilizado para armazenar questões, respostas e dados dos usuários.
- HTML, CSS e JavaScript: Tecnologias utilizadas no desenvolvimento da interface do usuário (front-end).


## Requisitos:
- Ter o Visual Studio Code instalado no seu computador 
- Ter o Git instalado no seu computador
> [!WARNING]
> Caso você não cumpra os requisitos minímos, veja aqui [como instalar o Visual Studio Code](https://youtu.be/uxln1hT_Ev4?si=vqeSVQ6lGZ66RF7g) e [como instalar o Git](https://www.youtube.com/watch?v=Am46OOLgV4s).

## Como executar o projeto:
1. Abra o Visual Studio Code
   
3. No seu teclado, pressione a tecla `F1`
   
4. Digite `git clone` e pressione `Enter`
   
5. Digite ou cole o comando: `https://github.com/Gabi-r7/Web-Simulado-ENEM.git` e pressione `Enter` em seguida
   
6. Na aba que surge, selecione a pasta desejada para salvar os arquivos do projeto, em seguida clique no botão `Selecionar como Destino do Repositório` ou pressione `Enter`
   
7. Aguarde alguns segundos para que o repositório seja clonado
   
8. No Pop up, clique em `Abrir` ou pressione `Enter`
   
9. Logo após, clique em `Sim, eu confio nos autores` ou pressione `Enter`
   
10. Pressione `Ctrl` + `'`
> `'` é o caractere de aspas simples, fica à esquerda do número 1 no teclado

10. Digite os seguintes comando em ordem:
    ```
    npm install --fix-broken
    npx prisma generate
    npx prisma migrate dev
    ```
    Os comandos acima precisam ser executados apenas na primeira vez em que você for executar o programa pois são comandos de configuração e instalação de dependências
    
12. Agora, digite o comando `npx ts-node ./src/server.ts` para executar o projeto
> [!IMPORTANT]
> Como descrito, este é o comando para a execução, sempre que você desejar executar o projeto, apenas este comando será necessário

12. Neste momento o projeto já estará rodando localmente em seu computador, acesse `http://127.0.0.1:3333` em qualquer navegador para desfrutar do projeto ou mantenha a tecla `Ctrl` pressionada em clique no link que aparece no terminal, assim como demonstrado na imagem abaixo:

![{Imagem do terminal mostrando o link para visualização do projeto}](https://github.com/user-attachments/assets/921ca440-ddf5-4984-bb1c-c2de16129ebe)

13. Pronto! Agora você já consegue interagir com nosso projeto e estudar tranquilamente para os vestibulares! 😄🎉
> [!NOTE]
> Para abrir o projeto novamente, depois de ter fechado o mesmo, será necessário abrir o Visual Studio Code novamente e executar o comando `npx ts-node ./src/server.ts`
