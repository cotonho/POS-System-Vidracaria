# POS System Vidraçaria — Vidraçaria do Marcinho

Este repositório contém o **código-fonte do sistema desenvolvido para a Vidraçaria do Marcinho**.  
O objetivo do sistema é **calcular e salvar orçamentos de pedidos de clientes**, além de **manter um registro dos pagamentos realizados** para cada orçamento.

---

## Desenvolvimento

O sistema foi desenvolvido em **ASP.NET Core**, utilizando o **padrão MVC (Model-View-Controller)**.

- **Banco de Dados:** integração realizada com **Entity Framework**, permitindo o mapeamento das entidades e operações de forma prática e segura.  
- **Interface:** construída com **Razor Pages**, que combinam **C# e HTML**, podendo ser usadas junto com **CSS** e **JavaScript** para compor a camada visual.  
- **Lógica de Negócio:** implementada em **C#** nos *Controllers*, com o uso de **JavaScript** para interações dinâmicas e comportamentos no lado do cliente.

A escolha do **ASP.NET** se deu principalmente por atender ao requisito de **ser executado localmente na máquina como um executável**, além de permitir **expansões futuras**, como a implementação de **funções de login e senha** e a **possibilidade de hospedagem como um site**, tornando o sistema acessível remotamente.

---
## Análise de Requisitos com o Cliente

Quando entrei em contato com o cliente, ele explicou que precisava de um sistema que auxiliasse nas operações da loja, pois a atendente não estava conseguindo atender todas as demandas, e não havia interesse em contratar mais funcionários.  
Como tudo na loja era feito no caderno a melhor opção seria desenvolver um sistema para computador que auxiliasse nessas funções e agilizasse o trabalho diário.

Fui então contatado para ajudar a decidir qual seria a melhor forma de resolver esse problema.  
Inicialmente, realizei uma análise de como o trabalho era executado na loja. O fato de a loja e a oficina funcionarem no mesmo espaço me deu uma boa noção da escala dos serviços prestados. Em seguida, observei como eram feitos os orçamentos, quantos eram calculados em média por dia e quantos realmente se convertiam em vendas.

Com essa análise, percebi que o principal problema da loja estava no **cálculo de orçamentos**, pois a quantidade de orçamentos solicitados era muito maior do que a de pedidos efetivamente fechados. As demais áreas de gestão não apresentavam grandes impactos no fluxo de trabalho.

Com base nessa analálise inicial, apresentei ao dono da loja a proposta de desenvolver um sistema que:
- Agilizasse o cálculo de orçamentos;
- Auxiliasse na organização das informações de clientes e materiais;
- Mantivesse um registro dos pagamentos realizados em cada pedido.

Essa solução resolveria o problema principal da loja, além de eliminar a necessidade de contratar um sistema comercial pronto — que, embora funcional, seria financeiramente inviável considerando a escala dos serviços prestados.
 

---
## Visão Geral do Sistema
### Página Inicial
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/650059cb-8eb3-418e-a5b7-89ae6c1c250d" />

Uma página simples, contendo apenas o botões para acessar as páginas de clientes, pedidos, orçamento e materiais.
### Página de Clientes
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6ae412a3-a2bb-4c16-9870-23f1506aa1ef" />

Esta página exibe as informações básicas dos clientes em uma **DataTable**, permitindo visualizar os detalhes de cada cliente, removê-los do banco de dados e registrar novos clientes.

### Página de Cadastro de Clientes
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/404bff27-f303-4a37-8c80-7cec3fdcfbf4" />

Nesta página é possível visualizar e editar as informações de um cliente. Caso o CPF informado não exista no banco de dados, a página funciona como um cadastro de novo cliente.

### Página de Materiais
<img width="1919" height="1076" alt="image" src="https://github.com/user-attachments/assets/4d690e53-237a-49bf-bcb6-84798ac87e53" />

Funciona de forma semelhante à página de clientes, exibindo os materiais registrados e permitindo adicionar, editar ou remover itens do banco de dados.

### Página de Cadastro/Edição de Materiais
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/cd84600f-98bf-47ee-a77e-979f04878f83" />

Permite visualizar e alterar informações dos materiais cadastrados. Caso o ID do item seja nulo ou 0, o sistema atribui automaticamente um novo valor e cadastra o material no banco de dados.

### Calculadora de Orçamento
#### Imagem 1
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/da2dc163-dea3-447c-aed2-ecd21a55dbfc" />

O usuário pode selecionar o cliente que solicitou o orçamento, definir o tipo de vidro, o tipo de instalação e a cor dos materiais a serem usados.  
O sistema pesquisa automaticamente no banco de dados os materiais necessários para a instalação e seleciona-os na cor desejada.  
Os vidros adicionados são exibidos temporariamente em uma **DataTable**, permitindo fácil visualização, alteração de quantidade ou remoção.

#### Imagem 2
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2ce9f4e3-f547-4e80-97a2-ab271a0f5fac" />

Os materiais disponíveis no banco de dados podem ser escolhidos na tabela da esquerda e adicionados à tabela da direita, que funciona como uma lista de compras.  
É possível alterar a quantidade de produtos ou removê-los.  
Ao final da página, são exibidos os valores do pedido, incluindo o custo total dos materiais para a loja e o valor total para o cliente, tanto à vista quanto parcelado.

### Como os orçamentos são salvos
Após calcular o orçamento na **Calculadora de Orçamento** e selecionar a opção **Salvar**, todos os campos do formulário e os itens das tabelas são percorridos e gravados em seus respectivos bancos de dados.

O orçamento tem todos os seus campos registrados e recebe uma *foreign key* que referencia o cliente ao qual está associado.  
Os vidros são salvos em uma tabela própria, onde cada vidro recebe seu próprio ID, além das *foreign keys* correspondentes ao ID do orçamento e ao ID do material do painel utilizado no cálculo.  
Os materiais também são armazenados em uma tabela específica que referencia o ID do material e o ID do orçamento, registrando apenas a **quantidade adquirida** e o **valor do item no momento da compra**, a fim de evitar possíveis inconsistências futuras.


<img width="983" height="634" alt="image" src="https://github.com/user-attachments/assets/15ff2d0c-4d9a-4fd2-a0e1-b1907208865b" />

### Arquitetura do sistema
<img width="792" height="546" alt="Diagrama sem nome drawio" src="https://github.com/user-attachments/assets/11fe7cc0-60e2-4e71-a6c8-d2fffbf2c467" />

## Como Executar o Projeto

Clone este repositório e abra o projeto no **Visual Studio**.  
Todas as dependências devem ser baixadas automaticamente via **NuGet**, mas caso ocorra algum problema, utilize a imagem abaixo como referência:

<img width="370" height="150" alt="image" src="https://github.com/user-attachments/assets/5afe4408-dff6-4461-a221-da9f7b4410f7" />

Após o download, será necessário criar o banco de dados no **MySQL**.  
Crie um novo *schema* e execute o arquivo **`vidracaria.sql`** para que o banco seja preenchido automaticamente.

Em seguida, abra o arquivo **`appsettings.json`** e substitua as informações da *Connection String* pelos dados do seu ambiente local:

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=seu_schema;user=seu_user;password=sua_senha"
}
```

Com tudo configurado, execute o arquivo **VidracariaDoMarcinho.sln** utilizando o perfil HTTPS e aguarde o carregamento do site.
